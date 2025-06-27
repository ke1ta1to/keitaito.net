import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const originDomainName = "srv1.eguchi.cc";
    const XOriginVerifyHeader = "replace-with-your-header-value";

    const distribution = new cloudfront.Distribution(
      this,
      "PortfolioDistribution",
      {
        defaultBehavior: {
          origin: new cloudfront_origins.HttpOrigin(originDomainName, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            httpPort: 8100,
            customHeaders: {
              "X-Origin-Verify": XOriginVerifyHeader,
            },
          }),
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
      },
    );

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
      description: "The domain name of the CloudFront distribution",
    });
  }
}
