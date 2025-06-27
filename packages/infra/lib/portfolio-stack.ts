import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";

interface PortfolioStackProps extends cdk.StackProps {
  customDomainName: string;
  hostedZoneDomainName: string;
  certificateArn: string;
  originDomainName: string;
  xOriginVerifyHeader: string;
}
export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PortfolioStackProps) {
    super(scope, id, props);

    const originDomainName = props.originDomainName;
    const XOriginVerifyHeader = props.xOriginVerifyHeader;

    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      "PortfolioCertificate",
      props.certificateArn,
    );

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
          cachePolicy:
            cloudfront.CachePolicy
              .USE_ORIGIN_CACHE_CONTROL_HEADERS_QUERY_STRINGS,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
        domainNames: [props.customDomainName],
        certificate,
      },
    );

    const zone = route53.HostedZone.fromLookup(this, "PortfolioZone", {
      domainName: props.hostedZoneDomainName,
    });

    new route53.ARecord(this, "PortfolioAliasRecord", {
      zone,
      recordName: props.customDomainName,
      target: route53.RecordTarget.fromAlias(
        new route53_targets.CloudFrontTarget(distribution),
      ),
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
      description: "The domain name of the CloudFront distribution",
    });
  }
}
