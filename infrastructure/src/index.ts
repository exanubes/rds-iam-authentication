#!/usr/bin/env node
import "source-map-support/register";
import { resolveCurrentUserOwnerName } from "@exanubes/cdk-utils";
import { App, Stack, Tags } from "aws-cdk-lib";

async function main() {
  const owner = await resolveCurrentUserOwnerName();
  const app = new App();
  const stack = new Stack(app, `IamAuthenticatedDatabaseStack`);

  Tags.of(app).add("owner", owner);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});