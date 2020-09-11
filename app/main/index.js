import path from 'path';
import db from '../main/database/models';
import Events from './events';
import { app, session, crashReporter, BrowserWindow, Menu, ipcMain } from 'electron';
import databaseInitializationCheck from './database/databaseInitializationCheck';
import Config from './Config';

const isDevelopment = process.env.NODE_ENV === 'development';
let mainWindow = null;
let forceQuit = false;

const gotTheLock = app.requestSingleInstanceLock();

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

crashReporter.start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false,
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  });

  app.on('ready', async () => {
    const basedir = isDevelopment ? 
      __dirname : 
      path.resolve(path.join(__dirname, '../../../../app/main'));
    const configs = Config(basedir);
    if (configs && configs.get().firstRun) {
      databaseInitializationCheck();
      configs.save({...configs.get(), firstRun: false});
    }

    if (isDevelopment) {
      await installExtensions();
    } else {
  
      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': ['default-src \'self\'']
          }
        })
      })
    }
    
    app.allowRendererProcessReuse = true;
  
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 1280,
      minHeight: 720,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
      },
      resizable: false,
      icon: __dirname + '/icon.ico',
    });
    mainWindow.loadFile(path.resolve(path.join(__dirname, '../renderer/index.html')));
  
    // show window once on first load
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.show();
    });
  
    mainWindow.webContents.on('did-finish-load', () => {
      // Handle window logic properly on macOS:
      // 1. App should not terminate if window has been closed
      // 2. Click on icon in dock should re-open the window
      // 3. ⌘+Q should close the window and quit the app
      if (process.platform === 'darwin') {
        mainWindow.on('close', function (e) {
          if (!forceQuit) {
            e.preventDefault();
            mainWindow.hide();
          }
        });
  
        app.on('activate', () => {
          mainWindow.show();
        });
  
        app.on('before-quit', () => {
          forceQuit = true;
        });
      } else {
        mainWindow.on('closed', () => {
          mainWindow = null;
        });
      }
    });
  
    if (isDevelopment) {
      mainWindow.webContents.on("did-frame-finish-load", () => {
        mainWindow.webContents.once("devtools-opened", () => {
          mainWindow.focus();
        });
        mainWindow.webContents.openDevTools();
      });
  
      // add inspect element on right click menu
      mainWindow.webContents.on('context-menu', (e, props) => {
        Menu.buildFromTemplate([
          {
            label: 'Inspect element',
            click() {
              mainWindow.inspectElement(props.x, props.y);
            },
          },
        ]).popup(mainWindow);
      });
    }

    try {
      Events.Revenue();
      Events.Expense();
      Events.Product();
      Events.Sale();
      Events.Customer();
      Events.Employee();
      Events.Report(mainWindow);
      Events.Options(mainWindow, basedir);
    } catch (e) {
      console.log(e);
    }
  });
}

ipcMain.on('restart-app', () => {
  app.relaunch();
  app.quit();
});

ipcMain.on('close-app', () => app.quit());

ipcMain.on('minimize-app', () => mainWindow.minimize());
let maximized = false;
ipcMain.on('maximize-app', () => {
  if (maximized) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize()
  }
  maximized = !maximized;
});

ipcMain.on('get-model', async (event, model, operation, values, options) => {
  try {
    event.returnValue = await db[model][operation](values, options);
  } catch (e) {
    console.log(e, 'main:getModel');
    event.returnValue = null;
  }
});

