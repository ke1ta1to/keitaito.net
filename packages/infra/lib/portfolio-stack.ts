import * as path from "path";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "ActivitiesTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const restApi = new apiGateway.RestApi(this, "PortfolioApi", {
      restApiName: `${this.stackName}Api`,
    });

    const distRoot = path.join(__dirname, "../../../dist/functions");

    const fn = new lambda.Function(this, "GetActivitiesFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "get-activities")),
    });
    table.grantReadData(fn);
    fn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const activities = restApi.root.addResource("activities");
    activities.addMethod("GET", new apiGateway.LambdaIntegration(fn));
  }
}
