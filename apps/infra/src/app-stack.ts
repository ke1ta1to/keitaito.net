import * as cdk from "aws-cdk-lib";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as apiGatewayV2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apiGatewayV2Integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const assetsBucket = new s3.Bucket(this, "AssetsBucket", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3deploy.BucketDeployment(this, "DeployAssets", {
      sources: [s3deploy.Source.asset("../blog/.open-next/assets")],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "_assets",
    });

    const serverFunc = new lambda.Function(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        "../blog/.open-next/server-functions/default",
      ),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
    });

    const httpApi = new apiGatewayV2.HttpApi(this, "HttpApi", {
      apiName: `${id}HttpApi`,
      defaultIntegration: new apiGatewayV2Integrations.HttpLambdaIntegration(
        "ServerIntegration",
        serverFunc,
      ),
    });

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

    const warmerFunc = new lambda.Function(this, "WarmerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../blog/.open-next/warmer-function"),
      memorySize: 256,
      timeout: cdk.Duration.seconds(5),
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

    const serverOrigin = new cloudfront_origins.HttpOrigin(
      cdk.Fn.parseDomainName(httpApi.apiEndpoint),
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
  var hostHeader = request.headers.host;
  if (hostHeader && hostHeader.value) {
    request.headers["x-forwarded-host"] = { value: hostHeader.value };
  }
  return request;
}
`),
      },
    );

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: serverOrigin,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy:
          cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: forwardedHostFunc,
          },
        ],
      },
      additionalBehaviors: {
        "/_next/data/*": {
          origin: serverOrigin,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        "/_next/image*": {
          origin: cloudfront_origins.FunctionUrlOrigin.withOriginAccessControl(
            imageOptimizerFuncUrl,
          ),
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        "/_next/*": {
          origin: assetsOrigin,
        },
        "/BUILD_ID": {
          origin: assetsOrigin,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
      },
    });

    new cdk.CfnOutput(this, "CloudFrontDomain", {
      value: distribution.distributionDomainName,
    });

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
