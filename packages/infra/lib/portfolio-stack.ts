import * as path from "path";

import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new apiGateway.RestApi(this, "PortfolioApi", {
      restApiName: `${this.stackName}Api`,
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
      },
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      signInAliases: { email: true },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const activitiesReadScope: cognito.ResourceServerScope = {
      scopeName: "activities.read",
      scopeDescription: "Read access to activities",
    };

    const activitiesWriteScope: cognito.ResourceServerScope = {
      scopeName: "activities.write",
      scopeDescription: "Write access to activities",
    };

    const resourceServer = userPool.addResourceServer("ResourceServer", {
      identifier: "api",
      scopes: [activitiesReadScope, activitiesWriteScope],
    });

    const oauthActivitiesRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      activitiesReadScope,
    );

    const oauthActivitiesWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      activitiesWriteScope,
    );

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      oAuth: {
        callbackUrls: ["http://localhost:3000/admin"],
        logoutUrls: ["http://localhost:3000/admin"],
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
          oauthActivitiesRead,
          oauthActivitiesWrite,
        ],
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
      },
    );

    const table = new dynamodb.Table(this, "ActivitiesTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distRoot = path.join(__dirname, "../../../dist/functions");

    const getActivitiesFn = new lambda.Function(this, "GetActivitiesFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "get-activities")),
    });
    table.grantReadData(getActivitiesFn);
    getActivitiesFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const getActivityFn = new lambda.Function(this, "GetActivityFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "get-activity")),
    });
    table.grantReadData(getActivityFn);
    getActivityFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const createActivityFn = new lambda.Function(
      this,
      "CreateActivityFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "create-activity")),
      },
    );
    table.grantWriteData(createActivityFn);
    createActivityFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const updateActivityFn = new lambda.Function(
      this,
      "UpdateActivityFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "update-activity")),
      },
    );
    table.grantReadWriteData(updateActivityFn);
    updateActivityFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const deleteActivityFn = new lambda.Function(
      this,
      "DeleteActivityFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "delete-activity")),
      },
    );
    table.grantWriteData(deleteActivityFn);
    deleteActivityFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const activities = restApi.root.addResource("activities");
    activities.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(getActivitiesFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesRead.scopeName],
      },
    );

    const activityById = activities.addResource("{id}");
    activityById.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(getActivityFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesRead.scopeName],
      },
    );
    activityById.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(updateActivityFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
    );
    activityById.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(deleteActivityFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
    );

    activities.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(createActivityFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
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
