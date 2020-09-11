import getCellKey from "./getCellKey";

export default (
  sheet, inventory, saleColumns, saleRows, customerDeliveryRows
) => {
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
}