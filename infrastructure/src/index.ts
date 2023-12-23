#!/usr/bin/env node
import "source-map-support/register";
import { resolveCurrentUserOwnerName } from "@exanubes/cdk-utils";
import { App, Tags } from "aws-cdk-lib";

import { IamAuthenticatedDatabaseStack } from "./iam-authenticated-database.stack";

async function main() {
  const owner = await resolveCurrentUserOwnerName();
  const app = new App();
  new IamAuthenticatedDatabaseStack(app, `IamAuthenticatedDatabaseStack`);
  Tags.of(app).add("owner", owner);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
