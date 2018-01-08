'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Board;
};
