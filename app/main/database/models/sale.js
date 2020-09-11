'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    paidValue: DataTypes.FLOAT,
    changeValue: DataTypes.FLOAT,
    delivered: DataTypes.BOOLEAN,
    nf: DataTypes.STRING
  }, {});
  Sale.associate = function(models) {
    Sale.belongsTo(models.Revenue);
    Sale.belongsTo(models.Customer);
    Sale.belongsTo(models.Employee, {as: 'Deliverer'});
    Sale.hasMany(models.SaleProduct, {onDelete: 'CASCADE'});
  };
  return Sale;
};