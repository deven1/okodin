"use strict";
var faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    var profiles = [];
    var maritalStatuses = [
      "Single",
      "Married",
      "Dating",
      "It's complicated",
      "Married to the game"
    ];
    var bodyTypes = [
      "Built like a god",
      "Built like a fish",
      "Built like a ground squirrel",
      "Built like a weird trapezoid",
      "Barely built at all"
    ];

    for (let i = 1; i < 501; i++) {
      var photo, gender;
      var age = Math.floor(Math.random() * 80) + 20;
      var height = Math.floor(Math.random() * 36) + 48;
      var location = Math.floor(Math.random() * 100) + 1;
      if (i % 2 === 0) {
        gender = "male";
        photo = "viking_guy.jpg";
      } else {
        gender = "female";
        photo = "viking_girl.jpg";
      }

      profiles.push({
        age: age,
        gender: gender,
        maritalStatus: maritalStatuses[
          Math.floor(Math.random() * maritalStatuses.length)
        ],
        height: height,
        bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
        children: Math.floor(Math.random() * 8),
        occupation: faker.name.jobType(),
        about: faker.lorem.paragraph(),
        talents: [
          faker.company.catchPhrase(),
          faker.company.catchPhrase(),
          faker.hacker.phrase()
        ],
        favorites: [
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence()
        ],
        whyMe: faker.company.bs(),
        pets: `${Math.floor(Math.random() * 8)} cats and ${Math.floor(Math.random() * 16)} dogs`,
        photo: photo,
        distance: Math.floor(Math.random() * 100) + 1,
        city: faker.address.city(),
        userId: i
      });
    }
    return queryInterface.bulkInsert("Profiles", profiles);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Profiles", null, {}, models.Profile);
  }
};
