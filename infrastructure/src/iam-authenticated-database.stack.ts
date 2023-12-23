import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
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

export class IamAuthenticatedDatabaseStack extends Stack {
  constructor(app: Construct, id: string, props?: StackProps) {
    super(app, id, props);
    const vpc = new Vpc(this, `vpc`, {
      natGateways: 0,
    });

    const rds = new DatabaseInstance(this, `rds-instance`, {
      vpc,
      vpcSubnets: {
        subnets: vpc.publicSubnets,
      },
      publiclyAccessible: true,
      databaseName: "exanubes",
      iamAuthentication: true,
      credentials: Credentials.fromGeneratedSecret("postgres"),
      engine: DatabaseInstanceEngine.POSTGRES,
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE3,
        InstanceSize.MICRO,
      ),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    rds.connections.allowFrom(
      Peer.anyIpv4(),
      Port.tcp(rds.instanceEndpoint.port),
      "Public connection",
    );

    const arn = this.formatArn({
      service: "rds-db",
      resource: "dbuser:" + rds.instanceIdentifier,
      resourceName: "admin",
    });

    const user = User.fromUserName(this, "admin-user", "admin");

    user.attachInlinePolicy(
      new Policy(this, "rds-access-policy", {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["rds-db:connect"],
            resources: [arn],
          }),
        ],
      }),
    );
  }
}
