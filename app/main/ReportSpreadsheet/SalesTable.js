export default (sheet, saleColumns, saleRows) => {
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
    rows: saleRows,
  });
}
