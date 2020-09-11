import getCellKey from "./getCellKey";

export default (sheet, rowNumber, colNumber, title, color, data) => {
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