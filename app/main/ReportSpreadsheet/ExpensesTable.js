import generalTwoColumnTable from "./generalTwoColumnTable";

export default (sheet, expenses, row, col) => {
  generalTwoColumnTable(
    sheet, row+1, col, 'DESPESAS', 'FF7C80', expenses
  );
}
