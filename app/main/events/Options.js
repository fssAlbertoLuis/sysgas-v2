import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import unzipper from 'unzipper';
import {ipcMain, dialog} from 'electron';
import Config from '../Config';
import moment from 'moment';

export default (mainWindow, dir) => {
  ipcMain.on('options:changeTheme', async (event, theme) => {
    try {
      const configs = Config(dir);
      configs.save({...configs.get(), theme: theme});
      event.returnValue = true;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('options:getTheme', async (event) => {
    try {
      const configs = Config(dir);
      event.returnValue = configs.get().theme;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('options:getBackupFile', (event) => {
    const filepath = dialog.showOpenDialogSync(mainWindow, {
      title: 'Selecione o arquivo de restauração',
    });
    event.returnValue = filepath ? filepath[0] : null;
  });

  ipcMain.on('options:restoreDatabase', async (event, filepath) => {
    try {
      const extension = path.extname(filepath);
      let dbfilepath = null;
      if (extension === '.zip') {
        const zip = fs.createReadStream(filepath).pipe(unzipper.Parse({
          forceStream: true
        }));
        for await (const entry of zip) {
          const fileName = entry.path;
          const type = entry.type; // 'Directory' or 'File'
          const size = entry.vars.uncompressedSize; // There is also compressedSize;
          if (path.extname(fileName) === ".sqlite3") {
            entry.pipe(fs.createWriteStream(filepath));
            dbfilepath = path.resolve(dir, './database/sysdb.sqlite3');
          } else {
            entry.autodrain();
          }
        }
      } else if (extension === '.sqlite3') {
        dbfilepath = path.resolve(dir, './database/sysdb.sqlite3');
      }
      if (dbfilepath) {
        var is = fs.createReadStream(filepath);
        var os = fs.createWriteStream(dbfilepath);
        is.pipe(os);
        is.on('end',function() {
          console.log('Database restore done successfully');
        });
        event.returnValue = filepath;
      } else {
        event.returnValue = null;
      }
    } catch (e) {
      console.log('Error trying restore database', e);
      event.returnValue = null;
    }
    
  });

  ipcMain.handle('options:res:backupDatabase', (event) => {
    const today = moment().format('DD-MM-YYYY');
    const defaultPath = 'Backup banco de dados '+today+'.zip';
    const filepath = dialog.showSaveDialogSync(mainWindow, {
      title: 'Salvar arquivo de backup',
      defaultPath: defaultPath
    });
    const dbfilepath = path.resolve(dir, './database/sysdb.sqlite3');
    const databaseExists = fs.existsSync(dbfilepath);
    if (databaseExists && filepath) {
      var output = fs.createWriteStream(filepath);
      var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
      });
      
      // This event is fired when the data source is drained no matter what was the data source.
      // It is not part of this library but rather from the NodeJS Stream API.
      // @see: https://nodejs.org/api/stream.html#stream_event_end
      output.on('end', function() {
        console.log('Data has been drained');
      });
      
      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
          console.log(err.message);
        } else {
          // throw error
          throw err;
        }
      });
      
      // good practice to catch this error explicitly
      archive.on('error', function(err) {
        throw err;
      });
      
      // pipe archive data to the file
      archive.pipe(output);

      archive.file(dbfilepath, { name: 'sysdb.sqlite3' });

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize();

    }
    return filepath;
  })
}
