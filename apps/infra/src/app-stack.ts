import * as path from "path";

import * as cdk from "aws-cdk-lib";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
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

    const restApi = new apiGateway.RestApi(this, "Api", {
      restApiName: `${id}Api`,
    });

    const activitiesResource = restApi.root.addResource("activities");
    activitiesResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(activitiesListFunc),
    );
    activitiesResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(activitiesCreateFunc),
    );

    const activityResource = activitiesResource.addResource("{id}");
    activityResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(activitiesGetFunc),
    );
    activityResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(activitiesUpdateFunc),
    );
    activityResource.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(activitiesDeleteFunc),
    );

    const skillsResource = restApi.root.addResource("skills");
    skillsResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(skillsListFunc),
    );
    skillsResource.addMethod(
      "POST",
      new apiGateway.LambdaIntegration(skillsCreateFunc),
    );

    const skillResource = skillsResource.addResource("{id}");
    skillResource.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(skillsGetFunc),
    );
    skillResource.addMethod(
      "PUT",
      new apiGateway.LambdaIntegration(skillsUpdateFunc),
    );
    skillResource.addMethod(
      "DELETE",
      new apiGateway.LambdaIntegration(skillsDeleteFunc),
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

    new cdk.CfnOutput(this, "Url", {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
