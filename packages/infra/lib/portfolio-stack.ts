import * as path from "path";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigatewayv2";
import * as apiGatewayIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const functionsDir = path.join(
      __dirname,
      "../../",
      "lambda-handlers/src/functions"
    );
    const getActivitiesFunction = new lambdaNodejs.NodejsFunction(
      this,
      "GetActivitiesFunction",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        entry: path.join(functionsDir, "get-activities.ts"),
      }
    );

    const api = new apiGateway.HttpApi(this, "PortfolioApi");
    api.addRoutes({
      methods: [apiGateway.HttpMethod.GET],
      path: "/activities",
      integration: new apiGatewayIntegrations.HttpLambdaIntegration(
        "GetActivitiesIntegration",
        getActivitiesFunction
      ),
    });

    new cdk.CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
  }
}
