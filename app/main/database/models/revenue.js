'use strict';
module.exports = (sequelize, DataTypes) => {
  const Revenue = sequelize.define('Revenue', {
    description: DataTypes.STRING,
    value: DataTypes.FLOAT,
    paymentType: DataTypes.STRING
  }, {});
  Revenue.associate = function(models) {
    Revenue.hasOne(models.Sale, {onDelete: 'CASCADE'});
  };
  return Revenue;
};