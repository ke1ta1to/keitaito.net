import * as path from "path";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new apiGateway.RestApi(this, "Api", {
      restApiName: `${id}Api`,
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS,
        allowHeaders: apiGateway.Cors.DEFAULT_HEADERS,
      },
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      signInAliases: { email: true },
      selfSignUpEnabled: false,
    });

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      oAuth: {
        callbackUrls: ["http://localhost:3000/admin"],
        logoutUrls: ["http://localhost:3000/admin"],
      },
    });

    new cognito.CfnManagedLoginBranding(this, "ManagedLoginBranding", {
      userPoolId: userPool.userPoolId,
      clientId: userPoolClient.userPoolClientId,
      useCognitoProvidedValues: true,
    });

    const userPoolDomain = userPool.addDomain("UserPoolDomain", {
      cognitoDomain: {
        domainPrefix: `${id.toLowerCase()}-${cdk.Aws.ACCOUNT_ID}`,
      },
      managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
    });

    const authorizer = new apiGateway.CognitoUserPoolsAuthorizer(
      this,
      "ApiAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );

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

    const createActivitiesFunction = new lambdaNodejs.NodejsFunction(
      this,
      "CreateActivitiesFunction",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        entry: path.join(functionsDir, "create-activities.ts"),
      }
    );

    const createActivityModel = new apiGateway.Model(
      this,
      "CreateActivityModel",
      {
        restApi,
        contentType: "application/json",
        schema: {
          schema: apiGateway.JsonSchemaVersion.DRAFT4,
          type: apiGateway.JsonSchemaType.OBJECT,
          additionalProperties: false,
          required: ["title"],
          properties: {
            title: {
              type: apiGateway.JsonSchemaType.STRING,
              minLength: 1,
              maxLength: 100,
            },
          },
        },
      }
    );

    const requestValidator = new apiGateway.RequestValidator(
      this,
      "BodyValidator",
      {
        restApi,
        validateRequestBody: true,
      }
    );

    const activities = restApi.root.addResource("activities");
    activities.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(getActivitiesFunction),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
      }
    );
    activities.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(createActivitiesFunction),
      {
        requestValidator,
        requestModels: {
          "application/json": createActivityModel,
        },
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
      }
    );

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "CognitoDomain", {
      value: userPoolDomain.domainName,
    });
  }
}
