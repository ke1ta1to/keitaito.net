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

    const tagTable = new dynamodb.Table(this, "TagCacheTable", {
      partitionKey: { name: "tag", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "path", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    tagTable.addGlobalSecondaryIndex({
      indexName: "revalidate",
      partitionKey: { name: "path", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "revalidatedAt", type: dynamodb.AttributeType.NUMBER },
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
        version: "2026-03-07 13:14:22",
      },
    });

    // Messaging: SQS

    const revalidationQueue = new sqs.Queue(this, "RevalidationQueue", {
      contentBasedDeduplication: true,
      visibilityTimeout: cdk.Duration.seconds(60),
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
      new lambdaEventSources.SqsEventSource(revalidationQueue),
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

    const forwardedHostFunc = new cloudfront.Function(
      this,
      "ForwardedHostFunction",
      {
        code: cloudfront.FunctionCode.fromInline(`function handler(event) {
  var request = event.request;
  request.headers["x-forwarded-host"] = request.headers.host;
  return request;
}
`),
      },
    );

    const forwardedHostFunctionAssociation: cloudfront.FunctionAssociation = {
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
      function: forwardedHostFunc,
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
        "/BUILD_ID": {
          origin: assetsOrigin,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    });

    new cdk.CfnOutput(this, "Url", {
      value: `https://${distribution.distributionDomainName}`,
    });

    // API: REST API

    const restApi = new apiGateway.RestApi(this, "Api", {
      restApiName: `${id}Api`,
    });

    restApi.root.addMethod(
      "GET",
      new apiGateway.MockIntegration({
        requestTemplates: {
          "application/json": JSON.stringify({ statusCode: 200 }),
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseTemplates: {
              "application/json": JSON.stringify({ ok: true }),
            },
            responseParameters: {
              "method.response.header.Content-Type": "'application/json'",
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Content-Type": true,
            },
          },
        ],
      },
    );
  }
}
