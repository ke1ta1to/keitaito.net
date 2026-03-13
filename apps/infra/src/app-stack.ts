import * as path from "path";

import * as cdk from "aws-cdk-lib";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as cr from "aws-cdk-lib/custom-resources";
import type { Construct } from "constructs";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // API: REST API

    const distRoot = path.join(
      import.meta.dirname,
      "../../functions/dist/functions",
    );

    const activitiesTable = new dynamodb.TableV2(this, "ActivitiesTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const activitiesListFunc = new lambda.Function(
      this,
      "ActivitiesListFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_list")),
        environment: {
          ACTIVITIES_TABLE: activitiesTable.tableName,
        },
      },
    );
    activitiesTable.grantReadData(activitiesListFunc);

    const activitiesCreateFunc = new lambda.Function(
      this,
      "ActivitiesCreateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_create")),
        environment: {
          ACTIVITIES_TABLE: activitiesTable.tableName,
        },
      },
    );
    activitiesTable.grantWriteData(activitiesCreateFunc);

    const activitiesGetFunc = new lambda.Function(
      this,
      "ActivitiesGetFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_get")),
        environment: {
          ACTIVITIES_TABLE: activitiesTable.tableName,
        },
      },
    );
    activitiesTable.grantReadData(activitiesGetFunc);

    const activitiesUpdateFunc = new lambda.Function(
      this,
      "ActivitiesUpdateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_update")),
        environment: {
          ACTIVITIES_TABLE: activitiesTable.tableName,
        },
      },
    );
    activitiesTable.grantReadWriteData(activitiesUpdateFunc);

    const activitiesDeleteFunc = new lambda.Function(
      this,
      "ActivitiesDeleteFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "activities_delete")),
        environment: {
          ACTIVITIES_TABLE: activitiesTable.tableName,
        },
      },
    );
    activitiesTable.grantWriteData(activitiesDeleteFunc);

    const skillsTable = new dynamodb.TableV2(this, "SkillsTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const skillsListFunc = new lambda.Function(this, "SkillsListFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_list")),
      environment: {
        SKILLS_TABLE: skillsTable.tableName,
      },
    });
    skillsTable.grantReadData(skillsListFunc);

    const skillsCreateFunc = new lambda.Function(this, "SkillsCreateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_create")),
      environment: {
        SKILLS_TABLE: skillsTable.tableName,
      },
    });
    skillsTable.grantWriteData(skillsCreateFunc);

    const skillsGetFunc = new lambda.Function(this, "SkillsGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_get")),
      environment: {
        SKILLS_TABLE: skillsTable.tableName,
      },
    });
    skillsTable.grantReadData(skillsGetFunc);

    const skillsUpdateFunc = new lambda.Function(this, "SkillsUpdateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_update")),
      environment: {
        SKILLS_TABLE: skillsTable.tableName,
      },
    });
    skillsTable.grantReadWriteData(skillsUpdateFunc);

    const skillsDeleteFunc = new lambda.Function(this, "SkillsDeleteFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "skills_delete")),
      environment: {
        SKILLS_TABLE: skillsTable.tableName,
      },
    });
    skillsTable.grantWriteData(skillsDeleteFunc);

    const articlesTable = new dynamodb.TableV2(this, "ArticlesTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const articlesListFunc = new lambda.Function(this, "ArticlesListFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "articles_list")),
      environment: {
        ARTICLES_TABLE: articlesTable.tableName,
      },
    });
    articlesTable.grantReadData(articlesListFunc);

    const articlesCreateFunc = new lambda.Function(
      this,
      "ArticlesCreateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "articles_create")),
        environment: {
          ARTICLES_TABLE: articlesTable.tableName,
        },
      },
    );
    articlesTable.grantWriteData(articlesCreateFunc);

    const articlesGetFunc = new lambda.Function(this, "ArticlesGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "articles_get")),
      environment: {
        ARTICLES_TABLE: articlesTable.tableName,
      },
    });
    articlesTable.grantReadData(articlesGetFunc);

    const articlesUpdateFunc = new lambda.Function(
      this,
      "ArticlesUpdateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "articles_update")),
        environment: {
          ARTICLES_TABLE: articlesTable.tableName,
        },
      },
    );
    articlesTable.grantReadWriteData(articlesUpdateFunc);

    const articlesDeleteFunc = new lambda.Function(
      this,
      "ArticlesDeleteFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "articles_delete")),
        environment: {
          ARTICLES_TABLE: articlesTable.tableName,
        },
      },
    );
    articlesTable.grantWriteData(articlesDeleteFunc);

    const worksTable = new dynamodb.TableV2(this, "WorksTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const worksListFunc = new lambda.Function(this, "WorksListFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "works_list")),
      environment: {
        WORKS_TABLE: worksTable.tableName,
      },
    });
    worksTable.grantReadData(worksListFunc);

    const worksCreateFunc = new lambda.Function(this, "WorksCreateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "works_create")),
      environment: {
        WORKS_TABLE: worksTable.tableName,
      },
    });
    worksTable.grantWriteData(worksCreateFunc);

    const worksGetFunc = new lambda.Function(this, "WorksGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "works_get")),
      environment: {
        WORKS_TABLE: worksTable.tableName,
      },
    });
    worksTable.grantReadData(worksGetFunc);

    const worksUpdateFunc = new lambda.Function(this, "WorksUpdateFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "works_update")),
      environment: {
        WORKS_TABLE: worksTable.tableName,
      },
    });
    worksTable.grantReadWriteData(worksUpdateFunc);

    const worksDeleteFunc = new lambda.Function(this, "WorksDeleteFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "works_delete")),
      environment: {
        WORKS_TABLE: worksTable.tableName,
      },
    });
    worksTable.grantWriteData(worksDeleteFunc);

    const profileTable = new dynamodb.TableV2(this, "ProfileTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const profileGetFunc = new lambda.Function(this, "ProfileGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "profile_get")),
      environment: {
        PROFILE_TABLE: profileTable.tableName,
      },
    });
    profileTable.grantReadData(profileGetFunc);

    const profileUpdateFunc = new lambda.Function(
      this,
      "ProfileUpdateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "profile_update")),
        environment: {
          PROFILE_TABLE: profileTable.tableName,
        },
      },
    );
    profileTable.grantReadWriteData(profileUpdateFunc);

    const contactTable = new dynamodb.TableV2(this, "ContactTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const contactGetFunc = new lambda.Function(this, "ContactGetFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: "bootstrap",
      code: lambda.Code.fromAsset(path.join(distRoot, "contact_get")),
      environment: {
        CONTACT_TABLE: contactTable.tableName,
      },
    });
    contactTable.grantReadData(contactGetFunc);

    const contactUpdateFunc = new lambda.Function(
      this,
      "ContactUpdateFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "contact_update")),
        environment: {
          CONTACT_TABLE: contactTable.tableName,
        },
      },
    );
    contactTable.grantReadWriteData(contactUpdateFunc);

    const restApi = new apiGateway.RestApi(this, "Api", {
      restApiName: `${id}Api`,
    });

    // Cognito

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
    const articlesReadScope: cognito.ResourceServerScope = {
      scopeName: "articles.read",
      scopeDescription: "Read access to articles",
    };
    const articlesWriteScope: cognito.ResourceServerScope = {
      scopeName: "articles.write",
      scopeDescription: "Write access to articles",
    };
    const skillsReadScope: cognito.ResourceServerScope = {
      scopeName: "skills.read",
      scopeDescription: "Read access to skills",
    };
    const skillsWriteScope: cognito.ResourceServerScope = {
      scopeName: "skills.write",
      scopeDescription: "Write access to skills",
    };
    const worksReadScope: cognito.ResourceServerScope = {
      scopeName: "works.read",
      scopeDescription: "Read access to works",
    };
    const worksWriteScope: cognito.ResourceServerScope = {
      scopeName: "works.write",
      scopeDescription: "Write access to works",
    };
    const profileReadScope: cognito.ResourceServerScope = {
      scopeName: "profile.read",
      scopeDescription: "Read access to profile",
    };
    const profileWriteScope: cognito.ResourceServerScope = {
      scopeName: "profile.write",
      scopeDescription: "Write access to profile",
    };
    const contactReadScope: cognito.ResourceServerScope = {
      scopeName: "contact.read",
      scopeDescription: "Read access to contact",
    };
    const contactWriteScope: cognito.ResourceServerScope = {
      scopeName: "contact.write",
      scopeDescription: "Write access to contact",
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
        articlesReadScope,
        articlesWriteScope,
        skillsReadScope,
        skillsWriteScope,
        worksReadScope,
        worksWriteScope,
        profileReadScope,
        profileWriteScope,
        contactReadScope,
        contactWriteScope,
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
    const oauthArticlesRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      articlesReadScope,
    );
    const oauthArticlesWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      articlesWriteScope,
    );
    const oauthSkillsRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      skillsReadScope,
    );
    const oauthSkillsWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      skillsWriteScope,
    );
    const oauthWorksRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      worksReadScope,
    );
    const oauthWorksWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      worksWriteScope,
    );
    const oauthProfileRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      profileReadScope,
    );
    const oauthProfileWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      profileWriteScope,
    );
    const oauthContactRead = cognito.OAuthScope.resourceServer(
      resourceServer,
      contactReadScope,
    );
    const oauthContactWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      contactWriteScope,
    );
    const oauthUploadsWrite = cognito.OAuthScope.resourceServer(
      resourceServer,
      uploadsWriteScope,
    );

    const authorizer = new apiGateway.CognitoUserPoolsAuthorizer(
      this,
      "ApiAuthorizer",
      { cognitoUserPools: [userPool] },
    );

    const activitiesResource = restApi.root.addResource("activities");
    activitiesResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(activitiesListFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesRead.scopeName],
      },
    );
    activitiesResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(activitiesCreateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
    );

    const activityResource = activitiesResource.addResource("{id}");
    activityResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(activitiesGetFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesRead.scopeName],
      },
    );
    activityResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(activitiesUpdateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
    );
    activityResource.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(activitiesDeleteFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthActivitiesWrite.scopeName],
      },
    );

    const skillsResource = restApi.root.addResource("skills");
    skillsResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(skillsListFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsRead.scopeName],
      },
    );
    skillsResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(skillsCreateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsWrite.scopeName],
      },
    );

    const skillResource = skillsResource.addResource("{id}");
    skillResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(skillsGetFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsRead.scopeName],
      },
    );
    skillResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(skillsUpdateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsWrite.scopeName],
      },
    );
    skillResource.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(skillsDeleteFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthSkillsWrite.scopeName],
      },
    );

    const articlesResource = restApi.root.addResource("articles");
    articlesResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(articlesListFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthArticlesRead.scopeName],
      },
    );
    articlesResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(articlesCreateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthArticlesWrite.scopeName],
      },
    );

    const articleResource = articlesResource.addResource("{id}");
    articleResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(articlesGetFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthArticlesRead.scopeName],
      },
    );
    articleResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(articlesUpdateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthArticlesWrite.scopeName],
      },
    );
    articleResource.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(articlesDeleteFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthArticlesWrite.scopeName],
      },
    );

    const worksResource = restApi.root.addResource("works");
    worksResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(worksListFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksRead.scopeName],
      },
    );
    worksResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(worksCreateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksWrite.scopeName],
      },
    );

    const workResource = worksResource.addResource("{id}");
    workResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(worksGetFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksRead.scopeName],
      },
    );
    workResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(worksUpdateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksWrite.scopeName],
      },
    );
    workResource.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(worksDeleteFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthWorksWrite.scopeName],
      },
    );

    const profileResource = restApi.root.addResource("profile");
    profileResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(profileGetFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthProfileRead.scopeName],
      },
    );
    profileResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(profileUpdateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthProfileWrite.scopeName],
      },
    );

    const contactResource = restApi.root.addResource("contact");
    contactResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(contactGetFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthContactRead.scopeName],
      },
    );
    contactResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(contactUpdateFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthContactWrite.scopeName],
      },
    );

    const uploadsBucket = new s3.Bucket(this, "UploadsBucket", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          maxAge: 3600,
        },
      ],
    });

    const uploadsPresignFunc = new lambda.Function(
      this,
      "UploadsPresignFunction",
      {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        architecture: lambda.Architecture.ARM_64,
        handler: "bootstrap",
        code: lambda.Code.fromAsset(path.join(distRoot, "uploads_presign")),
        environment: {
          UPLOADS_BUCKET: uploadsBucket.bucketName,
        },
      },
    );
    uploadsBucket.grantPut(uploadsPresignFunc);

    const uploadsResource = restApi.root.addResource("uploads");
    uploadsResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(uploadsPresignFunc),
      {
        authorizationType: apiGateway.AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [oauthUploadsWrite.scopeName],
      },
    );

    // Storage: S3

    const assetsBucket = new s3.Bucket(this, "AssetsBucket", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    new s3deploy.BucketDeployment(this, "DeployAssets", {
      sources: [s3deploy.Source.asset("../blog/.open-next/assets")],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "_assets",
      prune: false,
    });

    new s3deploy.BucketDeployment(this, "DeployCache", {
      sources: [s3deploy.Source.asset("../blog/.open-next/cache")],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "_cache",
      prune: false,
    });

    // Storage: DynamoDB (tag cache)

    const tagTable = new dynamodb.TableV2(this, "TagCacheTable", {
      partitionKey: { name: "tag", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "path", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      globalSecondaryIndexes: [
        {
          indexName: "revalidate",
          partitionKey: { name: "path", type: dynamodb.AttributeType.STRING },
          sortKey: {
            name: "revalidatedAt",
            type: dynamodb.AttributeType.NUMBER,
          },
        },
      ],
    });

    const dynamodbProviderFunc = new lambda.Function(
      this,
      "DynamoDBProviderFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        handler: "index.handler",
        code: lambda.Code.fromAsset("../blog/.open-next/dynamodb-provider"),
        memorySize: 256,
        environment: {
          TZ: "Asia/Tokyo",
          CACHE_DYNAMO_TABLE: tagTable.tableName,
        },
      },
    );
    tagTable.grantWriteData(dynamodbProviderFunc);

    const provider = new cr.Provider(this, "DynamodbProviderCR", {
      onEventHandler: dynamodbProviderFunc,
    });

    new cdk.CustomResource(this, "InitializeTagCache", {
      serviceToken: provider.serviceToken,
      properties: {
        version: "2026-03-08 16:17:58",
      },
    });

    // Messaging: SQS

    const revalidationQueue = new sqs.Queue(this, "RevalidationQueue", {
      fifo: true,
      contentBasedDeduplication: true,
      visibilityTimeout: cdk.Duration.seconds(60),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
    });

    // Compute: Server Function

    const serverFunc = new lambda.Function(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        "../blog/.open-next/server-functions/default",
      ),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      reservedConcurrentExecutions: 10,
      environment: {
        TZ: "Asia/Tokyo",
        CACHE_BUCKET_REGION: this.region,
        CACHE_BUCKET_NAME: assetsBucket.bucketName,
        CACHE_BUCKET_KEY_PREFIX: "_cache",
        REVALIDATION_QUEUE_REGION: this.region,
        REVALIDATION_QUEUE_URL: revalidationQueue.queueUrl,
        CACHE_DYNAMO_TABLE: tagTable.tableName,
        API_URL: restApi.url,
      },
    });

    assetsBucket.grantReadWrite(serverFunc);
    revalidationQueue.grantSendMessages(serverFunc);
    tagTable.grantReadWriteData(serverFunc);

    const serverFuncUrl = serverFunc.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    // Compute: Revalidation Function

    const revalidationFunc = new lambda.Function(this, "RevalidationFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../blog/.open-next/revalidation-function"),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        TZ: "Asia/Tokyo",
        REVALIDATION_QUEUE_REGION: this.region,
        REVALIDATION_QUEUE_URL: revalidationQueue.queueUrl,
      },
    });

    revalidationFunc.addEventSource(
      new lambdaEventSources.SqsEventSource(revalidationQueue, {
        batchSize: 5,
      }),
    );

    // Compute: Image Optimizer Function

    const imageOptimizerFunc = new lambda.Function(
      this,
      "ImageOptimizerFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "../blog/.open-next/image-optimization-function",
        ),
        memorySize: 512,
        timeout: cdk.Duration.seconds(10),
        environment: {
          TZ: "Asia/Tokyo",
          BUCKET_NAME: assetsBucket.bucketName,
          BUCKET_KEY_PREFIX: "_assets",
        },
      },
    );
    assetsBucket.grantRead(imageOptimizerFunc);

    const imageOptimizerFuncUrl = imageOptimizerFunc.addFunctionUrl();

    // Compute: Warmer Function

    const warmerFunc = new lambda.Function(this, "WarmerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../blog/.open-next/warmer-function"),
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        TZ: "Asia/Tokyo",
        WARM_PARAMS: JSON.stringify([
          { function: serverFunc.functionName, concurrency: 2 },
        ]),
      },
    });

    serverFunc.grantInvoke(warmerFunc);

    new events.Rule(this, "WarmerSchedule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
      targets: [new targets.LambdaFunction(warmerFunc)],
    });

    // CDN: CloudFront

    const serverOrigin = new cloudfront_origins.HttpOrigin(
      cdk.Fn.parseDomainName(serverFuncUrl.url),
    );

    const assetsOrigin =
      cloudfront_origins.S3BucketOrigin.withOriginAccessControl(assetsBucket, {
        originPath: "/_assets",
      });

    const forwardedHostFunctionAssociation: cloudfront.FunctionAssociation = {
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
      function: new cloudfront.Function(this, "ForwardedHostFunction", {
        code: cloudfront.FunctionCode.fromInline(`function handler(event) {
  var request = event.request;
  request.headers["x-forwarded-host"] = request.headers.host;
  return request;
}
`),
      }),
    };

    const imageCachePolicy = new cloudfront.CachePolicy(
      this,
      "ImageCachePolicy",
      {
        minTtl: cdk.Duration.seconds(0),
        defaultTtl: cdk.Duration.hours(4),
        maxTtl: cdk.Duration.days(1),
        headerBehavior: cloudfront.CacheHeaderBehavior.allowList("Accept"),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList(
          "url",
          "w",
          "q",
        ),
      },
    );

    const apiPathRewriteFunctionAssociation: cloudfront.FunctionAssociation = {
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
      function: new cloudfront.Function(this, "ApiPathRewriteFunction", {
        code: cloudfront.FunctionCode.fromInline(`function handler(event) {
  var request = event.request;
  if (request.uri.startsWith("/api/")) {
    request.uri = request.uri.slice(4);
  }
  return request;
}
`),
      }),
    };

    const uploadsPathRewriteFunctionAssociation: cloudfront.FunctionAssociation =
      {
        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        function: new cloudfront.Function(this, "UploadsPathRewriteFunction", {
          code: cloudfront.FunctionCode.fromInline(`function handler(event) {
  var request = event.request;
  if (request.uri.startsWith("/uploads/")) {
    request.uri = request.uri.slice(8);
  }
  return request;
}
`),
        }),
      };

    // Admin: S3 + CloudFront

    const adminBucket = new s3.Bucket(this, "AdminBucket", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    const adminRewriteFunctionAssociation: cloudfront.FunctionAssociation = {
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
      function: new cloudfront.Function(this, "AdminRewriteFunction", {
        runtime: cloudfront.FunctionRuntime.JS_2_0,
        code: cloudfront.FunctionCode.fromInline(`function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.match(/\\.[a-zA-Z0-9]+$/)) {
    return request;
  }
  if (!uri.endsWith("/")) {
    uri += "/";
  }
  request.uri = uri + "index.html";
  return request;
}
`),
      }),
    };

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: serverOrigin,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy:
          cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [forwardedHostFunctionAssociation],
      },
      additionalBehaviors: {
        "/api/*": {
          origin: new cloudfront_origins.RestApiOrigin(restApi),
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          functionAssociations: [apiPathRewriteFunctionAssociation],
        },
        "/_next/data/*": {
          origin: serverOrigin,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          functionAssociations: [forwardedHostFunctionAssociation],
        },
        "/_next/image*": {
          origin: cloudfront_origins.FunctionUrlOrigin.withOriginAccessControl(
            imageOptimizerFuncUrl,
          ),
          cachePolicy: imageCachePolicy,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        "/_next/*": {
          origin: assetsOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        "/admin*": {
          origin:
            cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
              adminBucket,
            ),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          functionAssociations: [adminRewriteFunctionAssociation],
        },
        "/uploads/*": {
          origin:
            cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
              uploadsBucket,
            ),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          functionAssociations: [uploadsPathRewriteFunctionAssociation],
        },
        "/BUILD_ID": {
          origin: assetsOrigin,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    });

    new s3deploy.BucketDeployment(this, "DeployAdmin", {
      sources: [s3deploy.Source.asset("../admin/out")],
      destinationBucket: adminBucket,
      destinationKeyPrefix: "admin",
      distribution,
      distributionPaths: ["/admin/*"],
    });

    // Cognito Clients & Domain

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        callbackUrls: [
          `https://${distribution.distributionDomainName}/admin/auth/callback/`,
          "http://localhost:3001/admin/auth/callback/",
        ],
        logoutUrls: [
          `https://${distribution.distributionDomainName}/admin/`,
          "http://localhost:3001/admin/",
        ],
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
          oauthActivitiesRead,
          oauthActivitiesWrite,
          oauthArticlesRead,
          oauthArticlesWrite,
          oauthSkillsRead,
          oauthSkillsWrite,
          oauthWorksRead,
          oauthWorksWrite,
          oauthProfileRead,
          oauthProfileWrite,
          oauthContactRead,
          oauthContactWrite,
          oauthUploadsWrite,
        ],
      },
    });

    const internalClient = new cognito.UserPoolClient(
      this,
      "InternalUserPoolClient",
      {
        userPool,
        generateSecret: true,
        oAuth: {
          flows: { clientCredentials: true },
          scopes: [
            oauthActivitiesRead,
            oauthArticlesRead,
            oauthSkillsRead,
            oauthWorksRead,
            oauthProfileRead,
            oauthContactRead,
          ],
        },
      },
    );

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

    serverFunc.addEnvironment(
      "COGNITO_CLIENT_ID",
      internalClient.userPoolClientId,
    );
    serverFunc.addEnvironment(
      "COGNITO_CLIENT_SECRET",
      internalClient.userPoolClientSecret.unsafeUnwrap(),
    );
    serverFunc.addEnvironment("COGNITO_DOMAIN", userPoolDomain.domainName);

    new cdk.CfnOutput(this, "Url", {
      value: `https://${distribution.distributionDomainName}`,
    });
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "InternalClientId", {
      value: internalClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "InternalClientSecret", {
      value: internalClient.userPoolClientSecret.unsafeUnwrap(),
    });
    new cdk.CfnOutput(this, "CognitoDomain", {
      value: userPoolDomain.domainName,
    });
  }
}
