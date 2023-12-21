const postgres = require("postgres");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const { drizzle } = require("drizzle-orm/postgres-js");
const { join } = require("node:path");
const { host, port, username, signer, db } = require("../src/const");

const client = postgres({
  host,
  port,
  username,
  db,
  ssl: "allow",
  password: async () => signer.getAuthToken(),
  max: 1,
});

async function dbMigrate() {
  await migrate(drizzle(client), {
    migrationsFolder: join(__dirname, "migrations"),
  });

  await client.end();
}

dbMigrate().catch((error) => {
  console.log("Failed while running migrations");
  console.log(error);
  process.exit(1);
});
