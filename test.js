const db = require('./app/main/database/models');
const ExcelJS = require('exceljs');
const moment = require('moment');
const {Op} = require('sequelize');
const d = moment();
const startOfDay = d.startOf('day').toISOString();
const endOfDay = d.endOf('day').toISOString();  
async function exec() {
  const products = await db.Product.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfDay, endOfDay]
      }
    }
  });
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
  const excel = new ExcelJS.Workbook();
  excel.creator = 'SysGás';
  excel.created = new Date();
  excel.calcProperties.fullCalcOnLoad = true;
  const sheet = excel.addWorksheet('Relatório');
  let saleColumns = [];
  let saleRows = [];
  let cashRevenues = [];
  let cardRevenues = [];
  let inventory = [];
  let customerDeliveryRows = [];
  let companyDeliveryRows = [];


  products.forEach((p, index) => {
    saleColumns.push({
      name: p.name, totalsRowFunction: 'sum', totalsRowLabel: '', filterButton: false, indexToInventory: index,
    });
    inventory.push({
      name: p.name, initialStock: p.quantity, finalStock: p.quantity, numOfSales: 0,
    });
  });

  revenues.forEach((revenue, index) => {
    if (revenue.Sale) {
      const sale = revenue.Sale;
      let row = saleColumns.map(c => ({name: c.name, qty: 0, indexToInventory: c.indexToInventory}));
      sale.SaleProducts.forEach(product => {
        const productRow = row.find(r => r.name === product.name);
        if (productRow) {
          const item = inventory[productRow.indexToInventory];
          if (item) {
            item.finalStock -= product.quantity;
            item.numOfSales = Math.abs(item.finalStock - item.initialStock);
          }
          productRow.qty += product.quantity;
        } else {
          saleColumns = [
            ...saleColumns, 
            {name: product.name, totalsRowFunction: 'sum'}
          ];
          row = [...row, {name: product.name, qty: product.quantity}];
        }
      });
      if (revenue.Sale.Customer && revenue.Sale.Deliverer) {
        if (revenue.Sale.Customer.type === 'empresa') {
          companyDeliveryRows = [
            ...companyDeliveryRows, 
            [
              revenue.Sale.Customer.name,
              ...row.map(r=>r.qty),
              revenue.value,
              revenue.Sale.nf,
              revenue.Sale.Deliverer.name,
            ]
          ];
        } else {
          customerDeliveryRows = [
            ...customerDeliveryRows, 
            [
              ...row.map(r=>r.qty),
              revenue.paymentType === 'dinheiro' ? revenue.value : 0,
              revenue.paymentType === 'cartão' ? revenue.value : 0,
              '',
              revenue.Sale.Deliverer.name,
              revenue.Sale.delivered ? 'sim' : 'não',
              revenue.Sale.Customer.address
            ]
          ];
        }
      } else {
        saleRows = [
          ...saleRows, 
          [
            ...row.map(r=>r.qty),
            revenue.paymentType === 'dinheiro' ? revenue.value : 0,
            revenue.paymentType === 'cartão' ? revenue.value : 0
          ]
        ]
      }
    } else {
      if (revenue.paymentType === 'dinheiro') {
        cashRevenues.push(revenue);
      } else {
        cardRevenues.push(revenue);
      }
    }
  });

  saleColumns = [
    ...saleColumns, 
    {name: 'dinheiro', totalsRowFunction: 'sum', filterButton: false},
    {name: 'cartão', totalsRowFunction: 'sum', filterButton: false},
  ];
  
  sheet.columns = [{header: 'VENDAS', key: 'sales'}];
  sheet.mergeCells(1,1,1,saleColumns.length);
  sheet.getCell(1, 1).style = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    font: {bold: true, size: 13},
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFFFF00'},
  bgColor:{argb:'FF0000FF'}
    }
  };
  sheet.addTable({
    name: 'Sales',
    ref: 'A2',
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'TableStyleLight2',
      showRowStripes: true,
    },
    columns: saleColumns,
    rows: saleRows.length ? saleRows : [new Array(saleColumns.length)],
  });

  //stock table
  let startRow = saleRows.length+5;
  let saleNumCols = saleColumns.length; //check number of cols to determine stock table
  const stockHeaders = [
    {header: 'Total de vendas', proportion: .6},
    {header: 'Estoque inicial', proportion: .2},
    {header: 'Estoque final', proportion: .2},
  ];
  const columnsIndexes = [
    {start: 0, end: 0},
    {start: 0, end: 0},
    {start: 0, end: 0}
  ];
  const headerStyles = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    font: {bold: true, size: 13},
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FF92D050'},
      bgColor:{argb:'FF0000FF'}
    }
  };
  let nextIndex = 0;
  stockHeaders.forEach((h, index) => {
    const end = nextIndex + Math.round(h.proportion * saleNumCols);
    const cell = sheet.getCell(startRow, nextIndex+1);
    cell.value = h.header;
    sheet.mergeCells(startRow, nextIndex+1, startRow, end);
    cell.style = headerStyles;
    columnsIndexes[index].start = nextIndex+1;
    columnsIndexes[index].end = end;
    nextIndex = end;
  });
  
  inventory.forEach((i, index) => {
    const realIndex = startRow + (index + 1);
    const cell = sheet.getCell(realIndex, 1);
    cell.style = {
      alignment: {
        horizontal: 'center', vertical: 'middle'
      },
      font: {bold: true, size: 13},
      fill: {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'}
      }
    }
    const commonStyle = {alignment: {horizontal: 'center', vertical: 'middle'}};
    cell.value = i.name;
    const numOfSalesCol = sheet.getCell(realIndex, columnsIndexes[0].start+1);
    const cellCountKeys = 
      `${getCellKey(index+1, startRow-2)}+`+
      `${getCellKey(saleNumCols+4+(index+1), 3+customerDeliveryRows.length)}`;
    numOfSalesCol.value = {formula: `=SUM(${cellCountKeys})`};
    numOfSalesCol.style = commonStyle;
    sheet.mergeCells(realIndex, columnsIndexes[0].start+1, realIndex, columnsIndexes[0].end);
    const initialStockCol = sheet.getCell(realIndex, columnsIndexes[1].start);
    initialStockCol.value = i.initialStock;
    initialStockCol.style = commonStyle;
    sheet.mergeCells(realIndex, columnsIndexes[1].start, realIndex, columnsIndexes[1].end);
    const finalCellCountKeys = 
      `${getCellKey(columnsIndexes[1].start, realIndex)}-`+
      `${getCellKey(columnsIndexes[0].start+1, realIndex)}`;
    const finalStockCol = sheet.getCell(realIndex, columnsIndexes[2].start);
    finalStockCol.value = {formula: `=SUM(${finalCellCountKeys})`};;
    finalStockCol.style = commonStyle;
    sheet.mergeCells(realIndex, columnsIndexes[2].start, realIndex, columnsIndexes[2].end);
  });

  //expenses columns
  startCol = saleColumns.length + 1;
  const generalHeaderCell = sheet.getCell(1, startCol);
  generalHeaderCell.value = "DATA: " + new Date().toLocaleDateString();
  generalHeaderCell.style = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    font: {bold: true, size: 13},
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFBFBFBF'},
      bgColor:{argb:'FF0000FF'}
    }
  }
  sheet.mergeCells(1, startCol, 1, startCol + 3);
  generalTwoColumnTable(
    sheet, 2, startCol, 'DESPESAS', 'FF7C80', expenses
  );
  const cashRevenueRow = 2+2+expenses.length;
  generalTwoColumnTable(
    sheet, cashRevenueRow, startCol, 'RECEBIMENTOS dinheiro', '92D050', cashRevenues
  );
  const cardRevenueRow = cashRevenueRow +2+cashRevenues.length;
  generalTwoColumnTable(
    sheet, cardRevenueRow, startCol, 'RECEBIMENTOS cartão', 'FFC000', cardRevenues
  );  

  const deliveryTableRef = {
    col: startCol+4, row: 1
  };
  const deliveryColData = [
    ...saleColumns,
    {name: 'Tipo de pedido', filterButton: false},
    {name: 'Entregador', filterButton: false},
    {name: 'Recebido', filterButton: false},
    {name: 'Endereço', filterButton: false}
  ]
  deliveryTable(sheet, deliveryTableRef, deliveryColData, customerDeliveryRows);

  const companyDeliveryTableRef = {
    col: startCol+4, row: customerDeliveryRows.length+4
  };
  const companyDeliveryColData = [
    {name: 'Empresa', totalsRowLabel: 'TOTAL:',filterButton: false},
    ...saleColumns.slice(0, saleColumns.length-2),
    {name: 'Valor', filterButton: false, totalsRowFunction: 'sum'},
    {name: 'NF', filterButton: false},
    {name: 'Entregador', filterButton: false}
  ];
  companyDeliveryTable(sheet, companyDeliveryTableRef, companyDeliveryColData, companyDeliveryRows);

  const resumeRow = cardRevenueRow + 2 + cardRevenues.length;
  const cardCellRef = [
    {row: resumeRow-1, col: startCol+2},
    {row: saleRows.length+3, col: saleColumns.length},
    {
      row: customerDeliveryRows.length+3, 
      col: deliveryTableRef.col+deliveryColData.length-5
    }
  ];
  const totalExpensesRef = {
    row: cashRevenueRow-1, col: startCol+2
  }
  const totalCashRefs = [
    {row: cardRevenueRow-1, col: startCol+2},
    {row: saleRows.length+3, col: saleColumns.length-1},
    {
      row: customerDeliveryRows.length+3, 
      col: deliveryTableRef.col+deliveryColData.length-6
    }
  ];
  resumeTable(
    sheet, resumeRow, startCol, cardCellRef, totalExpensesRef,
    totalCashRefs,
  );

  excel.xlsx.writeFile('test.xlsx');
}

function generalTwoColumnTable(
  sheet, 
  rowNumber, 
  colNumber,
  title, 
  color,
  data
) {
  
  const style = {
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FF'+color},
      bgColor:{argb:'FF0000FF'}
    }
  }
  const headerFooterStyle = {
    font: {bold: true, size: 13},
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FF'+color},
      bgColor:{argb:'FF0000FF'}
    }
  };
  
  const headereaderCell = sheet.getCell(rowNumber, colNumber);
  headereaderCell.value = title;
  headereaderCell.style = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    ...headerFooterStyle
  };
  sheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 3);

  data = data.length ? data : [{description: null, value: null}];
  data.forEach((d, index) => {
    const realIndex = index + rowNumber+1;

    sheet.mergeCells(realIndex, colNumber, realIndex, colNumber + 1);
    sheet.mergeCells(realIndex, colNumber+2, realIndex, colNumber + 3);

    const nameCell = sheet.getCell(realIndex, colNumber);
    nameCell.value = d.description;
    nameCell.style = style;
    
    const valueCell = sheet.getCell(realIndex, colNumber+2);
    valueCell.value = d.value;
    valueCell.style = {
      ...style, numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
    };
  });

  const footerStartRow = rowNumber+data.length+1;

  const totalCell = sheet.getCell(footerStartRow, colNumber);
  totalCell.value = 'TOTAL:';
  totalCell.style = headerFooterStyle;
  sheet.mergeCells(footerStartRow, colNumber, footerStartRow, colNumber + 1);
  const totalValueCell = sheet.getCell(footerStartRow, colNumber+2);
  const initialSumCell = getCellKey(colNumber+2, rowNumber+1);
  const finalSumCell = getCellKey(colNumber+2, rowNumber+data.length);
  totalValueCell.value = { formula: `=SUM(${initialSumCell}:${finalSumCell})`, result: 350 };
  totalValueCell.style = headerFooterStyle;
  totalValueCell.numFmt = '"R$"#,##0.00;[Red]-"R$"#,##0.00';
  sheet.mergeCells(footerStartRow, colNumber+2, footerStartRow, colNumber + 3);
}

function resumeTable(
  sheet, startRow, startCol, cardCellRefs, totalExpensesRef,
  totalCashRefs,
) {
  const baseStyle = {
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFFFF99'},
      bgColor:{argb:'FF0000FF'}
    }
  }
  sheet.mergeCells(startRow, startCol, startRow, startCol+3);
  const header = sheet.getCell(startRow, startCol);
  header.value = "RESUMO";
  header.style = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    font: {bold: true, size: 13},
    ...baseStyle,
  };
  sheet.mergeCells(startRow+1, startCol, startRow+1, startCol+1);
  sheet.mergeCells(startRow+1, startCol+2, startRow+1, startCol+3);
  const initialCash = sheet.getCell(startRow+1, startCol);
  initialCash.style = baseStyle;
  initialCash.value = 'Caixa inicial'
  const initialCashValue = sheet.getCell(startRow+1, startCol+2);
  initialCashValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };
  initialCashValue.value = 0;
  
  sheet.mergeCells(startRow+2, startCol, startRow+2, startCol+1);
  sheet.mergeCells(startRow+2, startCol+2, startRow+2, startCol+3);
  const cardMoney = sheet.getCell(startRow+2, startCol);
  cardMoney.style = baseStyle;
  cardMoney.value = 'Cartão';
  const cardMoneyValue = sheet.getCell(startRow+2, startCol+2);
  cardMoneyValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };
  const totalCardSum = [];
  cardCellRefs.forEach(ref => {
    totalCardSum.push(getCellKey(
      ref.col, ref.row
    ));
  });
  cardMoneyValue.value = { formula: `=${totalCardSum.join('+')}`};

  sheet.mergeCells(startRow+3, startCol, startRow+3, startCol+1);
  sheet.mergeCells(startRow+3, startCol+2, startRow+3, startCol+3);
  const cashRemoval = sheet.getCell(startRow+3, startCol);
  cashRemoval.style = baseStyle;
  cashRemoval.value = 'Sangria';
  const cashRemovalValue = sheet.getCell(startRow+3, startCol+2);
  cashRemovalValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };
  cashRemovalValue.value = 0;

  sheet.mergeCells(startRow+4, startCol, startRow+4, startCol+1);
  sheet.mergeCells(startRow+4, startCol+2, startRow+4, startCol+3);
  const totalExpenses = sheet.getCell(startRow+4, startCol);
  totalExpenses.style = baseStyle;
  totalExpenses.value = 'Gastos do dia';
  const totalExpensesValue = sheet.getCell(startRow+4, startCol+2);
  totalExpensesValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };
  const totalExpensesKey = getCellKey(
    totalExpensesRef.col, totalExpensesRef.row
  );
  totalExpensesValue.value = { formula: `=SUM(${totalExpensesKey})`};

  sheet.mergeCells(startRow+5, startCol, startRow+5, startCol+1);
  sheet.mergeCells(startRow+5, startCol+2, startRow+5, startCol+3);
  const totalCash = sheet.getCell(startRow+5, startCol);
  totalCash.style = baseStyle;
  totalCash.value = 'Total dinheiro';
  const totalCashValue = sheet.getCell(startRow+5, startCol+2);
  totalCashValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };
  const totalCashSum = [];
  totalCashRefs.forEach(ref => {
    totalCashSum.push(getCellKey(
      ref.col, ref.row
    ));
  });
  totalCashValue.value = { formula: `=${totalCashSum.join('+')}`};

  sheet.mergeCells(startRow+6, startCol, startRow+6, startCol+1);
  sheet.mergeCells(startRow+6, startCol+2, startRow+6, startCol+3);
  const total = sheet.getCell(startRow+6, startCol);
  total.style = baseStyle;
  total.value = 'Total gerado';
  const totalValue = sheet.getCell(startRow+6, startCol+2);
  totalValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };
  const totalCashCellKey = getCellKey(startCol+2, startRow+5);
  const cardMoneyCellKey = getCellKey(startCol+2, startRow+2);
  let totalSum = totalCashCellKey+'+'+cardMoneyCellKey;
  totalValue.value = { formula: `=SUM(${totalSum})`};

  sheet.mergeCells(startRow+7, startCol, startRow+7, startCol+1);
  sheet.mergeCells(startRow+7, startCol+2, startRow+7, startCol+3);
  const netTotal = sheet.getCell(startRow+7, startCol);
  netTotal.style = baseStyle;
  netTotal.value = 'Total líquido';
  const netTotalValue = sheet.getCell(startRow+7, startCol+2);
  netTotalValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };
  const cashRemovalCellKey = getCellKey(startCol+2, startRow+3);
  const totalExpensesCellKey = getCellKey(startCol+2, startRow+4);
  totalSum = totalCashCellKey+'-'+cashRemovalCellKey+'-'+totalExpensesCellKey;
  netTotalValue.value = { formula: `=SUM(${totalSum})`};

  sheet.mergeCells(startRow+8, startCol, startRow+8, startCol+1);
  sheet.mergeCells(startRow+8, startCol+2, startRow+8, startCol+3);
  const finalBalance = sheet.getCell(startRow+8, startCol);
  finalBalance.style = baseStyle;
  finalBalance.value = 'Caixa final';
  const finalBalanceValue = sheet.getCell(startRow+8, startCol+2);
  finalBalanceValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };

  sheet.mergeCells(startRow+9, startCol, startRow+9, startCol+1);
  sheet.mergeCells(startRow+9, startCol+2, startRow+9, startCol+3);
  const receipts = sheet.getCell(startRow+9, startCol);
  receipts.style = baseStyle;
  receipts.value = 'R$ N.fiscais';
  const receiptsValue = sheet.getCell(startRow+9, startCol+2);
  receiptsValue.style = {
    ...baseStyle,
    numFmt: '"R$"#,##0.00;[Red]-"R$"#,##0.00'
  };

  sheet.mergeCells(startRow+10, startCol, startRow+10, startCol+3);
  const observations = sheet.getCell(startRow+10, startCol);
  observations.style = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    font: {bold: true, size: 13},
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFBFBFBF'},
      bgColor:{argb:'FF0000FF'}
    }
  };
  observations.value = 'Observações';

  sheet.mergeCells(startRow+11, startCol, startRow+11, startCol+3);
}

function deliveryTable(sheet, ref, colData, rowData) {
  sheet.mergeCells(1, ref.col, 1, ref.col+colData.length-1);
  const headerCell = sheet.getCell(ref.row, ref.col);
  headerCell.style = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    font: {bold: true, size: 13},
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFFFF00'},
      bgColor:{argb:'FF0000FF'}
    }
  };
  headerCell.value = "ENTREGAS";
  sheet.addTable({
    name: 'Deliveries',
    ref: getCellKey(ref.col, 2),
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'TableStyleLight3',
      showRowStripes: true,
    },
    columns: colData,
    rows: rowData.length ? rowData : [new Array(colData.length)],
  });
}

function companyDeliveryTable(sheet, ref, colData, rowData) {
  sheet.mergeCells(ref.row, ref.col, ref.row, ref.col+colData.length);
  const headerCell = sheet.getCell(ref.row, ref.col);
  headerCell.style = {
    alignment: {
      horizontal: 'center', vertical: 'middle'
    },
    font: {bold: true, size: 13},
    fill: {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFFFF00'},
      bgColor:{argb:'FF0000FF'}
    }
  };
  headerCell.value = "ENTREGAS empresas";
  sheet.addTable({
    name: 'DeliveriesCompanies',
    ref: getCellKey(ref.col, ref.row+1),
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'TableStyleLight4',
      showRowStripes: true,
    },
    columns: colData,
    rows: rowData.length ? rowData : [new Array(colData.length)],
  });
}

function getCellKey(column, row) {
  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  const repeat = Math.floor(column / (letters.length+1));
  let letter = '';
  for (let i = 0; i < repeat; i++) {
    letter = letters[i];
  }
  const index = column - (repeat * letters.length);
  letter += letters[index - 1];
  return `${letter}${row}`;
}
exec();