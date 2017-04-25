var faker = require("faker");
("use strict");

module.exports = {
  up: function(queryInterface, Sequelize) {
    var users = [];
    for (let i = 1; i < 501; i++) {
      let firstName = faker.name.firstName();
      let lastName = faker.name.lastName();
      users.push({
        username: `${firstName}.${lastName}`,
        email: faker.internet.email(),
        profileId: i,
        lastLogin: faker.date.past()
      });
    }
    return queryInterface.bulkInsert("Users", users);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {}, models.User);
  }
};
