import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

export class PortfolioAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.DockerImageFunction(
      this,
      "PortfolioFunction",
      {
        code: lambda.DockerImageCode.fromEcr(
          ecr.Repository.fromRepositoryAttributes(this, "PortfolioRepository", {
            repositoryArn: cdk.Fn.importValue("RepositoryArn"),
            repositoryName: "portfolio-nextjs",
          }),
          {
            tagOrDigest: "latest",
          },
        ),
        memorySize: 1024,
        timeout: cdk.Duration.seconds(30),
      },
    );

    const functionUrl = lambdaFunction.addFunctionUrl({});

    const distribution = new cloudfront.Distribution(
      this,
      "PortfolioDistribution",
      {
        defaultBehavior: {
          origin:
            cloudfrontOrigins.FunctionUrlOrigin.withOriginAccessControl(
              functionUrl,
            ),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
    );

    const bucket = s3.Bucket.fromBucketArn(
      this,
      "PortfolioBucket",
      cdk.Fn.importValue("BucketArn"),
    );
    distribution.addBehavior(
      "/_next/static/*",
      cloudfrontOrigins.S3BucketOrigin.withOriginAccessControl(bucket),
      {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
    );

    new cdk.CfnOutput(this, "FunctionName", {
      value: lambdaFunction.functionName,
    });

    new cdk.CfnOutput(this, "FunctionImageUri", {
      value: `${this.account}.dkr.ecr.${this.region}.amazonaws.com/portfolio-nextjs:latest`,
    });
  }
}
