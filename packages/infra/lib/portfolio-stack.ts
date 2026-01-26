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

    new cognito.UserPoolClient(this, "InternalUserPoolClient", {
      userPool,
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: [oauthActivitiesRead],
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

    const activitiesListFn = new lambda.Function(
      this,
      "ActivitiesListFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_list")),
      },
    );
    table.grantReadData(activitiesListFn);
    activitiesListFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const activitiesGetFn = new lambda.Function(this, "ActivitiesGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "activities_get")),
    });
    table.grantReadData(activitiesGetFn);
    activitiesGetFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const activitiesCreateFn = new lambda.Function(
      this,
      "ActivitiesCreateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_create")),
      },
    );
    table.grantWriteData(activitiesCreateFn);
    activitiesCreateFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const activitiesUpdateFn = new lambda.Function(
      this,
      "ActivitiesUpdateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_update")),
      },
    );
    table.grantReadWriteData(activitiesUpdateFn);
    activitiesUpdateFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const activitiesDeleteFn = new lambda.Function(
      this,
      "ActivitiesDeleteFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_delete")),
      },
    );
    table.grantWriteData(activitiesDeleteFn);
    activitiesDeleteFn.addEnvironment("ACTIVITIES_TABLE_NAME", table.tableName);

    const activities = restApi.root.addResource("activities");
    activities.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(activitiesListFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesRead.scopeName],
      },
    );

    const activityById = activities.addResource("{id}");
    activityById.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(activitiesGetFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesRead.scopeName],
      },
    );
    activityById.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(activitiesUpdateFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
    );
    activityById.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(activitiesDeleteFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
    );

    activities.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(activitiesCreateFn),
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
