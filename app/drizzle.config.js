/**
 * @type {import('drizzle-kit').Config}
 * */
module.exports = {
  schema: "./src/users.js",
  out: "./database/migrations",
  driver: "pg",
};
