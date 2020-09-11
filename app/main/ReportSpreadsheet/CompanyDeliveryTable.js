import getCellKey from "./getCellKey";

export default (sheet, ref, colData, rowData) => {
  sheet.mergeCells(ref.row, ref.col, ref.row, ref.col+colData.length-1);
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
    rows: rowData,
  });
}
