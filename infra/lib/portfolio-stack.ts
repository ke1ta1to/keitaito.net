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

    const skillsReadScope: cognito.ResourceServerScope = {
      scopeName: "skills.read",
      scopeDescription: "Read access to skills",
    };

    const skillsWriteScope: cognito.ResourceServerScope = {
      scopeName: "skills.write",
      scopeDescription: "Write access to skills",
    };

    const profileReadScope: cognito.ResourceServerScope = {
      scopeName: "profile.read",
      scopeDescription: "Read access to profile",
    };

    const profileWriteScope: cognito.ResourceServerScope = {
      scopeName: "profile.write",
      scopeDescription: "Write access to profile",
    };

    const worksReadScope: cognito.ResourceServerScope = {
      scopeName: "works.read",
      scopeDescription: "Read access to works",
    };

    const worksWriteScope: cognito.ResourceServerScope = {
      scopeName: "works.write",
      scopeDescription: "Write access to works",
    };

    const contactReadScope: cognito.ResourceServerScope = {
      scopeName: "contact.read",
      scopeDescription: "Read access to contact",
    };

    const contactWriteScope: cognito.ResourceServerScope = {
      scopeName: "contact.write",
      scopeDescription: "Write access to contact",
    };

    const resourceServer = userPool.addResourceServer("ResourceServer", {
      identifier: "api",
      scopes: [
        activitiesReadScope,
        activitiesWriteScope,
        skillsReadScope,
        skillsWriteScope,
        profileReadScope,
        profileWriteScope,
        worksReadScope,
        worksWriteScope,
        contactReadScope,
        contactWriteScope,
      ],
    });

    const oauthActivitiesRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      activitiesReadScope,
    );

    const oauthActivitiesWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      activitiesWriteScope,
    );

    const oauthSkillsRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      skillsReadScope,
    );

    const oauthSkillsWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      skillsWriteScope,
    );

    const oauthProfileRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      profileReadScope,
    );

    const oauthProfileWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      profileWriteScope,
    );

    const oauthWorksRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      worksReadScope,
    );

    const oauthWorksWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      worksWriteScope,
    );

    const oauthContactRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      contactReadScope,
    );

    const oauthContactWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      contactWriteScope,
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
          oauthSkillsRead,
          oauthSkillsWrite,
          oauthProfileRead,
          oauthProfileWrite,
          oauthWorksRead,
          oauthWorksWrite,
          oauthContactRead,
          oauthContactWrite,
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
        scopes: [
          oauthActivitiesRead,
          oauthSkillsRead,
          oauthProfileRead,
          oauthWorksRead,
          oauthContactRead,
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

    const distRoot = path.join(__dirname, "../../dist/functions");

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

    // Skills Lambda functions
    const skillsListFn = new lambda.Function(this, "SkillsListFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_list")),
    });
    table.grantReadData(skillsListFn);
    skillsListFn.addEnvironment("SKILLS_TABLE_NAME", table.tableName);

    const skillsGetFn = new lambda.Function(this, "SkillsGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_get")),
    });
    table.grantReadData(skillsGetFn);
    skillsGetFn.addEnvironment("SKILLS_TABLE_NAME", table.tableName);

    const skillsCreateFn = new lambda.Function(this, "SkillsCreateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_create")),
    });
    table.grantWriteData(skillsCreateFn);
    skillsCreateFn.addEnvironment("SKILLS_TABLE_NAME", table.tableName);

    const skillsUpdateFn = new lambda.Function(this, "SkillsUpdateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_update")),
    });
    table.grantReadWriteData(skillsUpdateFn);
    skillsUpdateFn.addEnvironment("SKILLS_TABLE_NAME", table.tableName);

    const skillsDeleteFn = new lambda.Function(this, "SkillsDeleteFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_delete")),
    });
    table.grantWriteData(skillsDeleteFn);
    skillsDeleteFn.addEnvironment("SKILLS_TABLE_NAME", table.tableName);

    // Skills API Gateway resources
    const skillsResource = restApi.root.addResource("skills");
    skillsResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(skillsListFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsRead.scopeName],
      },
    );
    skillsResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(skillsCreateFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsWrite.scopeName],
      },
    );

    const skillById = skillsResource.addResource("{id}");
    skillById.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(skillsGetFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsRead.scopeName],
      },
    );
    skillById.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(skillsUpdateFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsWrite.scopeName],
      },
    );
    skillById.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(skillsDeleteFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsWrite.scopeName],
      },
    );

    // Works Lambda functions
    const worksListFn = new lambda.Function(this, "WorksListFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_list")),
    });
    table.grantReadData(worksListFn);
    worksListFn.addEnvironment("WORKS_TABLE_NAME", table.tableName);

    const worksGetFn = new lambda.Function(this, "WorksGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_get")),
    });
    table.grantReadData(worksGetFn);
    worksGetFn.addEnvironment("WORKS_TABLE_NAME", table.tableName);

    const worksCreateFn = new lambda.Function(this, "WorksCreateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_create")),
    });
    table.grantWriteData(worksCreateFn);
    worksCreateFn.addEnvironment("WORKS_TABLE_NAME", table.tableName);

    const worksUpdateFn = new lambda.Function(this, "WorksUpdateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_update")),
    });
    table.grantReadWriteData(worksUpdateFn);
    worksUpdateFn.addEnvironment("WORKS_TABLE_NAME", table.tableName);

    const worksDeleteFn = new lambda.Function(this, "WorksDeleteFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_delete")),
    });
    table.grantWriteData(worksDeleteFn);
    worksDeleteFn.addEnvironment("WORKS_TABLE_NAME", table.tableName);

    // Works API Gateway resources
    const worksResource = restApi.root.addResource("works");
    worksResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(worksListFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksRead.scopeName],
      },
    );
    worksResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(worksCreateFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksWrite.scopeName],
      },
    );

    const workById = worksResource.addResource("{id}");
    workById.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(worksGetFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksRead.scopeName],
      },
    );
    workById.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(worksUpdateFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksWrite.scopeName],
      },
    );
    workById.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(worksDeleteFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksWrite.scopeName],
      },
    );

    // Profile Lambda functions
    const profileGetFn = new lambda.Function(this, "ProfileGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "profile_get")),
    });
    table.grantReadData(profileGetFn);
    profileGetFn.addEnvironment("PROFILE_TABLE_NAME", table.tableName);

    const profileUpdateFn = new lambda.Function(
      this,
      "ProfileUpdateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "profile_update")),
      },
    );
    table.grantReadWriteData(profileUpdateFn);
    profileUpdateFn.addEnvironment("PROFILE_TABLE_NAME", table.tableName);

    // Profile API Gateway resources
    const profileResource = restApi.root.addResource("profile");
    profileResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(profileGetFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthProfileRead.scopeName],
      },
    );
    profileResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(profileUpdateFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthProfileWrite.scopeName],
      },
    );

    // Contact Lambda functions
    const contactGetFn = new lambda.Function(this, "ContactGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "contact_get")),
    });
    table.grantReadData(contactGetFn);
    contactGetFn.addEnvironment("CONTACT_TABLE_NAME", table.tableName);

    const contactUpdateFn = new lambda.Function(
      this,
      "ContactUpdateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "contact_update")),
      },
    );
    table.grantReadWriteData(contactUpdateFn);
    contactUpdateFn.addEnvironment("CONTACT_TABLE_NAME", table.tableName);

    // Contact API Gateway resources
    const contactResource = restApi.root.addResource("contact");
    contactResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(contactGetFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthContactRead.scopeName],
      },
    );
    contactResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(contactUpdateFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthContactWrite.scopeName],
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
