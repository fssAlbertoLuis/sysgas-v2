const { default: getCellKey } = require("./getCellKey");

export default (
  sheet, startRow, startCol, cardCellRefs, totalExpensesRef,
  totalCashRefs,
) => {
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