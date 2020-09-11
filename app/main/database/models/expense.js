'use strict';
module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    description: DataTypes.STRING,
    value: DataTypes.FLOAT,
    paymentType: DataTypes.STRING
  }, {});
  Expense.associate = function(models) {
    // associations can be defined here
  };
  return Expense;
};