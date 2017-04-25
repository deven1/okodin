"use strict";
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable("Profiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      age: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.STRING
      },
      maritalStatus: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.INTEGER
      },
      bodyType: {
        type: Sequelize.STRING
      },
      children: {
        type: Sequelize.INTEGER
      },
      occupation: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.TEXT
      },
      talents: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      favorites: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      whyMe: {
        type: Sequelize.TEXT
      },
      pets: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.TEXT
      },
      distance: {
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Profiles");
  }
};
