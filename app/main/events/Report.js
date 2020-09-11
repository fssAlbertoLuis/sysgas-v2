import {ipcMain, dialog} from 'electron';
import {Op} from 'sequelize';
import db from '../database/models';
import ReportSpreadsheet from '../ReportSpreadsheet';
import moment from 'moment';

export default (mainWindow) => {

  ipcMain.on('report:spreadsheet', async (event,date, mode='day') => {
    console.log('Requesting report spreadsheet...');
    const d = moment(date);
    const startOfDay = d.startOf(mode).toISOString();
    const endOfDay = d.endOf(mode).toISOString();  
    const savePath = dialog.showSaveDialogSync(mainWindow, {
      title: 'Selecione o local de armazenamento do relatório',
      defaultPath: `Relatório ${getSpreadSheetName(d, mode)}.xlsx`,
    });
    if (savePath) {
      const products = await db.Product.findAll();
      const revenues = await db.Revenue.findAll({
        include: [{
          model: db.Sale,
          include: ['Customer', 'Deliverer', 'SaleProducts']
        }],
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
      const expenses = await db.Expense.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
      try {
        const excel = ReportSpreadsheet(
          getSpreadSheetName(d, mode), products, expenses, revenues
        );
        console.log('Report spreadsheet done.');
        await excel.xlsx.writeFile(savePath);
        event.returnValue = {
          result: true,
          msg: 'Relatório salvo em: ' + savePath 
        };
      } catch (e) {
        console.log(e);
        event.returnValue = {
          result: false,
          error: {
            code: e.code,
            msg: e.message
          }
        };
      }
    } else {
      console.log('Report spreadsheet cancelled.');
      event.returnValue = {
        result: false,
        error: null
      }
    }
  });
}

function getSpreadSheetName(date, mode) {
  switch(mode) {
    case 'year':
      return 'ano '+date.format('YYYY');
    case 'month':
      return 'mês '+date.format('MMMM YYYY');
    default:
      return 'Diário '+date.format('DD-MM-YYYY');
  }
}
