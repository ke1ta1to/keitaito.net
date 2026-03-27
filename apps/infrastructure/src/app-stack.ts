import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as customResources from "aws-cdk-lib/custom-resources";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";

export interface AppStackProps extends cdk.StackProps {
  distDir: string;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const { distDir } = props;

    const assetsBucket = new s3.Bucket(this, "AssetsBucket", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    new s3deploy.BucketDeployment(this, "DeployStatic", {
      sources: [s3deploy.Source.asset(path.resolve(distDir, "assets/_next"))],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "_assets/_next",
      prune: false,
      cacheControl: [
        s3deploy.CacheControl.fromString("public,max-age=31536000,immutable"),
      ],
    });

    new s3deploy.BucketDeployment(this, "DeployBuildId", {
      sources: [
        s3deploy.Source.asset(path.resolve(distDir, "assets"), {
          exclude: ["**", "!BUILD_ID"],
        }),
      ],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "_assets",
      prune: false,
      cacheControl: [
        s3deploy.CacheControl.fromString(
          "public,max-age=0,s-maxage=31536000,must-revalidate",
        ),
      ],
    });

    new s3deploy.BucketDeployment(this, "DeployCache", {
      sources: [s3deploy.Source.asset(path.resolve(distDir, "cache"))],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "_cache",
      prune: false,
    });

    const tagTable = new dynamodb.TableV2(this, "TagTable", {
      partitionKey: {
        name: "tag",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "path",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      globalSecondaryIndexes: [
        {
          indexName: "revalidate",
          partitionKey: {
            name: "path",
            type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
            name: "revalidatedAt",
            type: dynamodb.AttributeType.NUMBER,
          },
        },
      ],
    });

    const dynamodbProviderFunction = new lambda.Function(
      this,
      "DynamoDBProviderFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        handler: "index.handler",
        code: lambda.Code.fromAsset(path.resolve(distDir, "dynamodb-provider")),
        memorySize: 256,
        environment: {
          CACHE_DYNAMO_TABLE: tagTable.tableName,
        },
      },
    );
    tagTable.grantReadWriteData(dynamodbProviderFunction);

    const provider = new customResources.Provider(this, "InitializeTagCache", {
      onEventHandler: dynamodbProviderFunction,
    });

    // routes / tags の初期投入対象を変更したときだけ手動で version を bump
    new cdk.CustomResource(this, "InitializeTagCacheResource", {
      serviceToken: provider.serviceToken,
      properties: {
        version: "manual-v1",
      },
    });

    const revalidationQueue = new sqs.Queue(this, "RevalidationQueue", {
      fifo: true,
      contentBasedDeduplication: true,
      visibilityTimeout: cdk.Duration.seconds(1800),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      deadLetterQueue: {
        queue: new sqs.Queue(this, "RevalidationDeadLetterQueue", {
          fifo: true,
          contentBasedDeduplication: true,
          retentionPeriod: cdk.Duration.days(14),
        }),
        maxReceiveCount: 5,
      },
    });

    const serverFunction = new lambda.Function(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.resolve(distDir, "server-functions", "default"),
      ),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(70),
      environment: {
        CACHE_BUCKET_REGION: this.region,
        CACHE_BUCKET_NAME: assetsBucket.bucketName,
        CACHE_BUCKET_KEY_PREFIX: "_cache",
        REVALIDATION_QUEUE_REGION: this.region,
        REVALIDATION_QUEUE_URL: revalidationQueue.queueUrl,
        CACHE_DYNAMO_TABLE: tagTable.tableName,
        OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE: "true",
      },
    });
    assetsBucket.grantReadWrite(serverFunction);
    revalidationQueue.grantSendMessages(serverFunction);
    tagTable.grantReadWriteData(serverFunction);

    // POST / PUT で x-amz-content-sha256 の計算は困難であるためNONEを指定
    const serverFunctionUrl = serverFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
    });

    const revalidationFunction = new lambda.Function(
      this,
      "RevalidationFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          path.resolve(distDir, "revalidation-function"),
        ),
        memorySize: 512,
        timeout: cdk.Duration.seconds(300),
        environment: {
          REVALIDATION_QUEUE_REGION: this.region,
          REVALIDATION_QUEUE_URL: revalidationQueue.queueUrl,
        },
      },
    );
    revalidationFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(revalidationQueue, {
        batchSize: 5,
        reportBatchItemFailures: true,
      }),
    );

    const imageOptimizationFunction = new lambda.Function(
      this,
      "ImageOptimizationFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          path.resolve(distDir, "image-optimization-function"),
        ),
        memorySize: 512,
        timeout: cdk.Duration.seconds(30),
        environment: {
          BUCKET_NAME: assetsBucket.bucketName,
          BUCKET_KEY_PREFIX: "_assets",
        },
      },
    );
    assetsBucket.grantRead(imageOptimizationFunction);

    const imageOptimizationFunctionUrl =
      imageOptimizationFunction.addFunctionUrl({
        authType: lambda.FunctionUrlAuthType.AWS_IAM,
      });

    const warmerFunction = new lambda.Function(this, "WarmerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.resolve(distDir, "warmer-function")),
      memorySize: 256,
      timeout: cdk.Duration.seconds(60),
      environment: {
        WARM_PARAMS: JSON.stringify([
          { function: serverFunction.functionName, concurrency: 2 },
        ]),
      },
    });
    serverFunction.grantInvoke(warmerFunction);

    new events.Rule(this, "WarmerSchedule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
      targets: [new targets.LambdaFunction(warmerFunction)],
    });

    const serverOrigin = new cloudfront_origins.HttpOrigin(
      cdk.Fn.parseDomainName(serverFunctionUrl.url),
      {
        readTimeout: cdk.Duration.seconds(60),
        keepaliveTimeout: cdk.Duration.seconds(60),
      },
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

    // CDN でキャッシュする際
    // const serverCachePolicy = new cloudfront.CachePolicy(
    //   this,
    //   "ServerCachePolicy",
    //   {
    //     queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
    //     headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
    //       "accept",
    //       "rsc",
    //       "next-router-prefetch",
    //       "next-router-state-tree",
    //       "next-url",
    //       "x-prerender-revalidate",
    //     ),
    //     cookieBehavior: cloudfront.CacheCookieBehavior.none(),
    //     enableAcceptEncodingGzip: true,
    //     enableAcceptEncodingBrotli: true,
    //     defaultTtl: cdk.Duration.days(0),
    //     maxTtl: cdk.Duration.days(365),
    //     minTtl: cdk.Duration.days(0),
    //   },
    // );

    const imageCachePolicy = new cloudfront.CachePolicy(
      this,
      "ImageCachePolicy",
      {
        minTtl: cdk.Duration.seconds(0),
        defaultTtl: cdk.Duration.days(365),
        maxTtl: cdk.Duration.days(365),
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
        "/_next/image*": {
          origin: cloudfront_origins.FunctionUrlOrigin.withOriginAccessControl(
            imageOptimizationFunctionUrl,
            {
              readTimeout: cdk.Duration.seconds(30),
              keepaliveTimeout: cdk.Duration.seconds(60),
            },
          ),
          cachePolicy: imageCachePolicy,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          functionAssociations: [forwardedHostFunctionAssociation],
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
        "/_next/*": {
          origin: assetsOrigin,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
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

    const distributionArn = `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${distribution.distributionId}`;

    imageOptimizationFunction.addPermission("InvokeUrlFromCloudFront", {
      principal: new iam.ServicePrincipal("cloudfront.amazonaws.com"),
      action: "lambda:InvokeFunctionUrl",
      sourceArn: distributionArn,
    });

    imageOptimizationFunction.addPermission(
      "InvokeFunctionFromCloudFrontViaUrl",
      {
        principal: new iam.ServicePrincipal("cloudfront.amazonaws.com"),
        action: "lambda:InvokeFunction",
        sourceArn: distributionArn,
        invokedViaFunctionUrl: true,
      },
    );

    new cdk.CfnOutput(this, "Url", {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
