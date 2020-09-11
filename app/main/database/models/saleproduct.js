'use strict';
module.exports = (sequelize, DataTypes) => {
  const SaleProduct = sequelize.define('SaleProduct', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {});
  SaleProduct.associate = function(models) {
    SaleProduct.belongsTo(models.Sale);
  };
  return SaleProduct;
};