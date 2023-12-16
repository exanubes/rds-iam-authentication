#!/usr/bin/env node
import "source-map-support/register";
import { resolveCurrentUserOwnerName } from "@exanubes/cdk-utils";
import { App, RemovalPolicy, Stack, Tags } from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
} from "aws-cdk-lib/aws-rds";
import { Effect, Policy, PolicyStatement, User } from "aws-cdk-lib/aws-iam";

async function main() {
  const owner = await resolveCurrentUserOwnerName();
  const app = new App();
  const stack = new Stack(app, `IamAuthenticatedDatabaseStack`);
  const vpc = new Vpc(stack, `vpc`, {
    natGateways: 0,
  });

  const rds = new DatabaseInstance(stack, `rds-instance`, {
    vpc,
    vpcSubnets: {
      subnets: vpc.publicSubnets,
    },
    publiclyAccessible: true,
    databaseName: "exanubes",
    iamAuthentication: true,
    credentials: Credentials.fromGeneratedSecret("postgres"),
    engine: DatabaseInstanceEngine.POSTGRES,
    instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MICRO),
    removalPolicy: RemovalPolicy.DESTROY,
  });

  rds.connections.allowFrom(
    Peer.anyIpv4(),
    Port.tcp(rds.instanceEndpoint.port),
    "Public connection",
  );

  const arn = stack.formatArn({
    service: "rds-db",
    resource: "dbuser:" + rds.instanceIdentifier,
    resourceName: "admin",
  });

  const user = User.fromUserName(stack, "admin-user", "admin");

  user.attachInlinePolicy(
    new Policy(stack, "rds-access-policy", {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["rds-db:connect"],
          resources: [arn],
        }),
      ],
    }),
  );
  Tags.of(app).add("owner", owner);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
