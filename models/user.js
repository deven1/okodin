"use strict";
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      profileId: DataTypes.INTEGER,
      lastLogin: DataTypes.DATE
    },
    {
      classMethods: {
        associate: function(models) {
          User.hasOne(models.Profile, {
            foreignKey: "userId"
          });
        }
      }
    }
  );
  return User;
};
