import getCellKey from "./getCellKey";

export default (sheet, ref, colData, rowData) => {
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
    rows: rowData,
  });
}
