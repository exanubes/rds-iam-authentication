const { faker } = require("@faker-js/faker");

const UserType = ["admin", "premium", "free"];

function createNewUser() {
  return {
    fullName: faker.person.fullName(),
    phone: "+" + faker.helpers.fromRegExp(/[0-9]{11}/),
    type: UserType[
      faker.number.int({
        min: 0,
        max: 2,
      })
    ],
  };
}

module.exports = {
  createNewUser,
};
