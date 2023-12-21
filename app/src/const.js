const { Signer } = require("@aws-sdk/rds-signer");
const host =
  "dbInstanceIdentifier.region.rds.amazonaws.com";
const port = 5432;
const username = "admin";
const db = "exanubes";

const signer = new Signer({
  hostname: host,
  port,
  username,
});

module.exports = {
  signer,
  host,
  port,
  username,
  db,
};
