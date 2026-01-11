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
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      signInAliases: { email: true },
    });

    const scopes = [
      new cognito.ResourceServerScope({
        scopeName: "activities.read",
        scopeDescription: "Read access to activities",
      }),
      new cognito.ResourceServerScope({
        scopeName: "activities.write",
        scopeDescription: "Write access to activities",
      }),
    ];

    const resourceServer = userPool.addResourceServer("ResourceServer", {
      identifier: "portfolio-api",
      scopes,
    });

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: scopes.map((scope) =>
          cognito.OAuthScope.resourceServer(resourceServer, scope)
        ),
      },
    });

    const userPoolDomain = new cognito.UserPoolDomain(this, "UserPoolDomain", {
      userPool,
      cognitoDomain: {
        domainPrefix: `${id.toLowerCase()}-${cdk.Aws.ACCOUNT_ID}`,
      },
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
        authorizationScopes: ["portfolio-api/activities.read"],
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
        authorizationScopes: ["portfolio-api/activities.write"],
      }
    );

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "UserPoolClientSecret", {
      value: userPoolClient.userPoolClientSecret.unsafeUnwrap(),
    });
    new cdk.CfnOutput(this, "CognitoDomain", {
      value: userPoolDomain.domainName,
    });
  }
}
