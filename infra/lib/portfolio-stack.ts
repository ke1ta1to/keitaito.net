import * as path from "path";

import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

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

    const articlesReadScope: cognito.ResourceServerScope = {
      scopeName: "articles.read",
      scopeDescription: "Read access to articles",
    };

    const articlesWriteScope: cognito.ResourceServerScope = {
      scopeName: "articles.write",
      scopeDescription: "Write access to articles",
    };

    const uploadsWriteScope: cognito.ResourceServerScope = {
      scopeName: "uploads.write",
      scopeDescription: "Write access to uploads",
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
        articlesReadScope,
        articlesWriteScope,
        uploadsWriteScope,
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

    const oauthArticlesRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      articlesReadScope,
    );

    const oauthArticlesWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      articlesWriteScope,
    );

    const oauthUploadsWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      uploadsWriteScope,
    );

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      oAuth: {
        callbackUrls: ["http://localhost:3000/admin-test"],
        logoutUrls: ["http://localhost:3000/admin-test"],
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
          oauthArticlesRead,
          oauthArticlesWrite,
          oauthUploadsWrite,
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
          oauthArticlesRead,
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

    const tableProps: dynamodb.TableProps = {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    };

    const activitiesTable = new dynamodb.Table(this, "ActivitiesTable", {
      ...tableProps,
    });
    const skillsTable = new dynamodb.Table(this, "SkillsTable", {
      ...tableProps,
    });
    const worksTable = new dynamodb.Table(this, "WorksTable", {
      ...tableProps,
    });
    const profileTable = new dynamodb.Table(this, "ProfileTable", {
      ...tableProps,
    });
    const contactTable = new dynamodb.Table(this, "ContactTable", {
      ...tableProps,
    });
    const articlesCacheTable = new dynamodb.Table(
      this,
      "ArticlesCacheTable",
      {
        ...tableProps,
      },
    );

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
    activitiesTable.grantReadData(activitiesListFn);
    activitiesListFn.addEnvironment("TABLE_NAME", activitiesTable.tableName);

    const activitiesGetFn = new lambda.Function(this, "ActivitiesGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "activities_get")),
    });
    activitiesTable.grantReadData(activitiesGetFn);
    activitiesGetFn.addEnvironment("TABLE_NAME", activitiesTable.tableName);

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
    activitiesTable.grantWriteData(activitiesCreateFn);
    activitiesCreateFn.addEnvironment("TABLE_NAME", activitiesTable.tableName);

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
    activitiesTable.grantReadWriteData(activitiesUpdateFn);
    activitiesUpdateFn.addEnvironment("TABLE_NAME", activitiesTable.tableName);

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
    activitiesTable.grantWriteData(activitiesDeleteFn);
    activitiesDeleteFn.addEnvironment("TABLE_NAME", activitiesTable.tableName);

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
    skillsTable.grantReadData(skillsListFn);
    skillsListFn.addEnvironment("TABLE_NAME", skillsTable.tableName);

    const skillsGetFn = new lambda.Function(this, "SkillsGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_get")),
    });
    skillsTable.grantReadData(skillsGetFn);
    skillsGetFn.addEnvironment("TABLE_NAME", skillsTable.tableName);

    const skillsCreateFn = new lambda.Function(this, "SkillsCreateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_create")),
    });
    skillsTable.grantWriteData(skillsCreateFn);
    skillsCreateFn.addEnvironment("TABLE_NAME", skillsTable.tableName);

    const skillsUpdateFn = new lambda.Function(this, "SkillsUpdateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_update")),
    });
    skillsTable.grantReadWriteData(skillsUpdateFn);
    skillsUpdateFn.addEnvironment("TABLE_NAME", skillsTable.tableName);

    const skillsDeleteFn = new lambda.Function(this, "SkillsDeleteFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_delete")),
    });
    skillsTable.grantWriteData(skillsDeleteFn);
    skillsDeleteFn.addEnvironment("TABLE_NAME", skillsTable.tableName);

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
    worksTable.grantReadData(worksListFn);
    worksListFn.addEnvironment("TABLE_NAME", worksTable.tableName);

    const worksGetFn = new lambda.Function(this, "WorksGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_get")),
    });
    worksTable.grantReadData(worksGetFn);
    worksGetFn.addEnvironment("TABLE_NAME", worksTable.tableName);

    const worksCreateFn = new lambda.Function(this, "WorksCreateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_create")),
    });
    worksTable.grantWriteData(worksCreateFn);
    worksCreateFn.addEnvironment("TABLE_NAME", worksTable.tableName);

    const worksUpdateFn = new lambda.Function(this, "WorksUpdateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_update")),
    });
    worksTable.grantReadWriteData(worksUpdateFn);
    worksUpdateFn.addEnvironment("TABLE_NAME", worksTable.tableName);

    const worksDeleteFn = new lambda.Function(this, "WorksDeleteFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(distRoot, "works_delete")),
    });
    worksTable.grantWriteData(worksDeleteFn);
    worksDeleteFn.addEnvironment("TABLE_NAME", worksTable.tableName);

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
    profileTable.grantReadData(profileGetFn);
    profileGetFn.addEnvironment("TABLE_NAME", profileTable.tableName);

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
    profileTable.grantReadWriteData(profileUpdateFn);
    profileUpdateFn.addEnvironment("TABLE_NAME", profileTable.tableName);

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
    contactTable.grantReadData(contactGetFn);
    contactGetFn.addEnvironment("TABLE_NAME", contactTable.tableName);

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
    contactTable.grantReadWriteData(contactUpdateFn);
    contactUpdateFn.addEnvironment("TABLE_NAME", contactTable.tableName);

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

    // Articles Lambda functions
    const articlesListFn = new lambda.Function(
      this,
      "ArticlesListFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(path.join(distRoot, "articles_list")),
      },
    );
    articlesCacheTable.grantReadData(articlesListFn);
    articlesListFn.addEnvironment(
      "TABLE_NAME",
      articlesCacheTable.tableName,
    );

    const articlesCollectorFn = new lambda.Function(
      this,
      "ArticlesCollectorFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(
          path.join(distRoot, "articles_collector"),
        ),
        timeout: cdk.Duration.seconds(30),
      },
    );
    articlesCacheTable.grantWriteData(articlesCollectorFn);
    articlesCollectorFn.addEnvironment(
      "TABLE_NAME",
      articlesCacheTable.tableName,
    );
    articlesCollectorFn.addEnvironment("ZENN_USERNAME", "kk79it");
    articlesCollectorFn.addEnvironment("QIITA_USERNAME", "ke1ta1to");

    new events.Rule(this, "ArticlesCollectorSchedule", {
      schedule: events.Schedule.cron({ hour: "0", minute: "0" }),
      targets: [new targets.LambdaFunction(articlesCollectorFn)],
    });

    const articlesCollectFn = new lambda.Function(
      this,
      "ArticlesCollectFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(
          path.join(distRoot, "articles_collect"),
        ),
        timeout: cdk.Duration.seconds(30),
      },
    );
    articlesCacheTable.grantWriteData(articlesCollectFn);
    articlesCollectFn.addEnvironment(
      "TABLE_NAME",
      articlesCacheTable.tableName,
    );
    articlesCollectFn.addEnvironment("ZENN_USERNAME", "kk79it");
    articlesCollectFn.addEnvironment("QIITA_USERNAME", "ke1ta1to");

    // Uploads S3 bucket
    const uploadsBucket = new s3.Bucket(this, "UploadsBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    // Uploads Lambda function
    const uploadsPresignFn = new lambda.Function(
      this,
      "UploadsPresignFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: "bootstrap",
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(
          path.join(distRoot, "uploads_presign"),
        ),
      },
    );
    uploadsBucket.grantPut(uploadsPresignFn);
    uploadsBucket.grantRead(uploadsPresignFn);
    uploadsPresignFn.addEnvironment("BUCKET_NAME", uploadsBucket.bucketName);

    // Uploads API Gateway resources
    const uploadsResource = restApi.root.addResource("uploads");
    const uploadsPresignResource = uploadsResource.addResource("presign");
    uploadsPresignResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(uploadsPresignFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthUploadsWrite.scopeName],
      },
    );

    // Articles API Gateway resources
    const articlesResource = restApi.root.addResource("articles");
    articlesResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(articlesListFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthArticlesRead.scopeName],
      },
    );

    const articlesCollectResource = articlesResource.addResource("collect");
    articlesCollectResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(articlesCollectFn),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthArticlesWrite.scopeName],
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
