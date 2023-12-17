const postgres = require("postgres");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const { drizzle } = require("drizzle-orm/postgres-js");
const { Signer } = require("@aws-sdk/rds-signer");
const { join } = require("node:path");
const fs = require("node:fs");
const host =
  "iamauthenticateddatabasestack-rdsinstance46c79398-7fdzaabpuk5t.cifv3asjnpxa.eu-central-1.rds.amazonaws.com";
const port = 5432;
const username = "admin";

const signer = new Signer({
  hostname: host,
  port,
  username,
});

const client = postgres({
  host,
  port,
  username,
  db: "exanubes",
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
