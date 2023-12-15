# RDS IAM Authentication

A small demo of creating a Postgres RDS Instance with IAM Authentication enabled and connecting to it from
a simple NodeJS application.

## Setup

Repository is split into two directories - `app` and `infrastructure`.

All commands are runnable from the root of the repository.

| Script           | Description                                                        |
|------------------|--------------------------------------------------------------------|
| npm start        | Starts the Node.js server                                          |
| npm run setup    | Installs all dependencies for project root, app and infrastructure |
| npm run synth    | Synthesizes the CDK stack                                          |
| npm run deploy   | Deploys the CDK stack                                              |
| npm run destroy  | Destroys the CDK stack                                             |
| npm run cleanup  | Removes all node_modules from project root, app and infrastructure |


## Preparing a database for IAM Authentication

Apart from the cdk stack, you will need to manually prepare the database to allow for
IAM authentication.

1. Deploy the RDS Stack
2. Go to the Secrets Manager console and find the secret for the RDS instance
3. Go to your CLI and run this command after replacing host with the host from the secret 
```bash
    psql -h $RDSHOST -p 5432 -U postgres -d exanubes
```
4. That command will then prompt you to enter a password, which is part of the secret
5. Create a new user/role with `CREATE USER admin;`
6. Grant the user/role privileges for RDS IAM with `GRANT rds_iam TO iamuser;`

## Connect to RDS with IAM Token from CLI

Once you have the database prepared, you can generate an IAM token in the CLI with the following command:

```bash
export IAMTOKEN="$(aws rds generate-db-auth-token --hostname $RDSHOST --port 5432 --region eu-central-1 --username admin)"
```

And then use the generated token with this command to connect to the database:

```bash
psql -h $RDSHOST -p 5432 "dbname=exanubes user=admin password=$IAMTOKEN“
```

## Known issues

1. Can't find meta/_journal.json file

> This means that the path to `migrationsFolder` is incorrect when creating a drizzle client in the migrations script

2. Permission denied for database `database_name`

> Means the database user does not have sufficient permissions to connect to the database. I found that this can be fixed
> by granting `rds_superuser` role to the user. Could not find a better solution or a reason why this is happening considering
> that connecting to the database via CLI works correctly.