import ExcelJS from 'exceljs';
import SalesTable from './SalesTable';
import StockTable from './StockTable';
import ExpensesTable from './ExpensesTable';
import CashRevenueTable from './CashRevenueTable';
import generalTwoColumnTable from "./generalTwoColumnTable";
import DeliveryTable from './DeliveryTable';
import CompanyDeliveryTable from './CompanyDeliveryTable';
import ResumeTable from './ResumeTable';

export default (spreadSheetName, products, expenses, revenues) => {
  const worksheet = new ExcelJS.Workbook();
  worksheet.creator = 'SysGás';
  worksheet.created = new Date();
  worksheet.calcProperties.fullCalcOnLoad = true;
  const sheet = worksheet.addWorksheet('Relatório');
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
            item.initialStock += product.quantity;
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

  saleRows = saleRows.length ? saleRows : [new Array(saleColumns.length)];
  expenses = expenses.length ? expenses : [{description: null, value: null}];
  cashRevenues = cashRevenues.length ?
    cashRevenues : [{description: null, value: null}];
  cardRevenues = cardRevenues.length ?
    cardRevenues : [{description: null, value: null}];
  
  SalesTable(sheet, saleColumns, saleRows);

  StockTable(sheet, inventory, saleColumns, saleRows, customerDeliveryRows);

  const expensesRow = 1;
  const expensesCol = saleColumns.length + 1;

  const cell = sheet.getCell(expensesRow, expensesCol);
  cell.value = 'Relatório ' + spreadSheetName;
  cell.style = {
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
  sheet.mergeCells(1, expensesCol, expensesRow, expensesCol + 3);
  ExpensesTable(sheet, expenses, expensesRow, expensesCol);

  const cashRevenueRow = 2+2+expenses.length;
  const cashRevenueCol = expensesCol;
  CashRevenueTable(sheet, cashRevenues, cashRevenueRow, cashRevenueCol);

  const cardRevenueRow = cashRevenueRow +2+cashRevenues.length;
  const cardRevenueCol = cashRevenueCol;
  generalTwoColumnTable(
    sheet, cardRevenueRow, cardRevenueCol, 'RECEBIMENTOS cartão', 'FFC000', cardRevenues
  );

  const deliveryTableRef = {
    col: expensesCol+4, row: 1
  };
  const deliveryColData = [
    ...saleColumns,
    {name: 'Tipo de pedido', filterButton: false},
    {name: 'Entregador', filterButton: false},
    {name: 'Recebido', filterButton: false},
    {name: 'Endereço', filterButton: false}
  ]
  customerDeliveryRows = customerDeliveryRows.length ?
    customerDeliveryRows : [new Array(deliveryColData.length)];
  DeliveryTable(sheet, deliveryTableRef, deliveryColData, customerDeliveryRows);

  const companyDeliveryTableRef = {
    col: expensesCol+4, row: customerDeliveryRows.length+4
  };
  const companyDeliveryColData = [
    {name: 'Empresa', totalsRowLabel: 'TOTAL:',filterButton: false},
    ...saleColumns.slice(0, saleColumns.length-2),
    {name: 'Valor', filterButton: false, totalsRowFunction: 'sum'},
    {name: 'NF', filterButton: false},
    {name: 'Entregador', filterButton: false}
  ];
  companyDeliveryRows = companyDeliveryRows.length ?
    companyDeliveryRows : [new Array(companyDeliveryColData.length)];
  CompanyDeliveryTable(
    sheet, companyDeliveryTableRef, companyDeliveryColData, companyDeliveryRows
  );

  const resumeRow = cardRevenueRow + 2 + cardRevenues.length;
  const cardCellRef = [
    {row: resumeRow-1, col: expensesCol+2},
    {row: saleRows.length+3, col: saleColumns.length},
    {
      row: customerDeliveryRows.length+3, 
      col: deliveryTableRef.col+deliveryColData.length-5
    }
  ];
  const totalExpensesRef = {
    row: cashRevenueRow-1, col: expensesCol+2
  }
  const totalCashRefs = [
    {row: cardRevenueRow-1, col: expensesCol+2},
    {row: saleRows.length+3, col: saleColumns.length-1},
    {
      row: customerDeliveryRows.length+3, 
      col: deliveryTableRef.col+deliveryColData.length-6
    }
  ];
  ResumeTable(
    sheet, resumeRow, expensesCol, cardCellRef, totalExpensesRef,
    totalCashRefs,
  );

  return worksheet;
}