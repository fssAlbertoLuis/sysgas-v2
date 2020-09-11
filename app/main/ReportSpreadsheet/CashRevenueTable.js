import generalTwoColumnTable from "./generalTwoColumnTable";

export default (sheet, revenues, row, col) => {
  generalTwoColumnTable(
    sheet, row, col, 'RECEBIMENTOS dinheiro', '92D050', revenues
  );
}
