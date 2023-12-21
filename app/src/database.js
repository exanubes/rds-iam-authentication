const postgres = require("postgres");
const { drizzle } = require("drizzle-orm/postgres-js");
const { host, port, username, signer, db } = require("./const");

const client = postgres({
  host,
  port,
  username,
  db,
  ssl: "allow",
  password: async () => signer.getAuthToken(),
});

const database = drizzle(client);

module.exports = { database };
