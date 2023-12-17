const { faker } = require("@faker-js/faker");
const { pgEnum, pgTable, uuid, varchar, text } = require("drizzle-orm/pg-core");

const UserType = pgEnum("UserType", ["admin", "premium", "free"]);

const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  phone: varchar("phone", { length: 12 }).unique().notNull(),
  type: UserType("type").notNull(),
});

/**
 * @returns {typeof Users.$inferInsert}
 * */
function createNewUser() {
  return {
    fullName: faker.person.fullName(),
    phone: "+" + faker.helpers.fromRegExp(/[0-9]{11}/),
    type: UserType.enumValues[
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
