export default (column, row) => {
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
