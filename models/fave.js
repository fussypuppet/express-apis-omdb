'use strict';
module.exports = (sequelize, DataTypes) => {
  const fave = sequelize.define('fave', {
    title: DataTypes.STRING,
    imdbid: DataTypes.STRING
  }, {});
  fave.associate = function(models) {
    // associations can be defined here
  };
  return fave;
};