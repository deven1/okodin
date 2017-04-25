"use strict";
module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define(
    "Profile",
    {
      age: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      maritalStatus: DataTypes.STRING,
      height: DataTypes.INTEGER,
      bodyType: DataTypes.STRING,
      children: DataTypes.INTEGER,
      occupation: DataTypes.STRING,
      about: DataTypes.TEXT,
      talents: DataTypes.ARRAY(DataTypes.TEXT),
      favorites: DataTypes.ARRAY(DataTypes.TEXT),
      whyMe: DataTypes.TEXT,
      pets: DataTypes.STRING,
      photo: DataTypes.TEXT,
      distance: DataTypes.INTEGER,
      city: DataTypes.STRING,
      userId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          Profile.hasOne(models.User, {
            foreignKey: "profileId"
          });
        }
      }
    }
  );
  return Profile;
};
