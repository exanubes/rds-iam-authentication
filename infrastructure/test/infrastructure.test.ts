// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import * as Infrastructure from '../lib/infrastructure-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/infrastructure-stack.ts
import { App } from "aws-cdk-lib";
import { IamAuthenticatedDatabaseStack } from "../src/iam-authenticated-database.stack";
import { Match, Template } from "aws-cdk-lib/assertions";

test("RDS with IAM Authentication", () => {
  const app = new App();
  //     // WHEN
  const stack = new IamAuthenticatedDatabaseStack(app, "TestStack");
  //     // THEN
  const template = Template.fromStack(stack);
  console.log(JSON.stringify(template, null, 4));
  template.hasResourceProperties("AWS::RDS::DBInstance", {
    AllocatedStorage: "100",
    DBInstanceClass: "db.t3.micro",
    EnableIAMDatabaseAuthentication: true,
    Engine: "postgres",
    PubliclyAccessible: true,
  });

  template.resourceCountIs("AWS::EC2::VPC", 1);
  template.resourceCountIs("AWS::EC2::NatGateway", 0);
  template.resourceCountIs("AWS::SecretsManager::Secret", 1);
  template.resourceCountIs("AWS::EC2::InternetGateway", 1);
  template.resourceCountIs("AWS::EC2::Subnet", 4);
  template.resourceCountIs("AWS::EC2::SecurityGroup", 1);

  template.hasResourceProperties("AWS::EC2::SecurityGroupIngress", {
    CidrIp: "0.0.0.0/0",
  });
  template.hasResourceProperties("AWS::IAM::Policy", {
    PolicyDocument: {
      Statement: [
        {
          Action: "rds-db:connect",
          Effect: "Allow",
          Resource: {
            "Fn::Join": [
              "",
              [
                "arn:",
                Match.anyValue(),
                ":rds-db:",
                Match.anyValue(),
                ":",
                Match.anyValue(),
                ":dbuser:",
                Match.anyValue(),
                "/admin",
              ],
            ],
          },
        },
      ],
    },
  });
});
