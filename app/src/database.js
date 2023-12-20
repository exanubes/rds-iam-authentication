const {Signer} = require("@aws-sdk/rds-signer");
const postgres = require("postgres");
const {drizzle} = require("drizzle-orm/postgres-js");
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
});

const database = drizzle(client);