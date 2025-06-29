#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { PortfolioStack } from "../lib/portfolio-stack";

dotenv.config();

const app = new cdk.App();
new PortfolioStack(app, "PortfolioStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  certificateArn: process.env.CERTIFICATE_ARN as string,
  customDomainName: process.env.CUSTOM_DOMAIN_NAME as string,
  hostedZoneDomainName: process.env.HOSTED_ZONE_DOMAIN_NAME as string,
  originDomainName: process.env.ORIGIN_DOMAIN_NAME as string,
  xOriginVerifyHeader: process.env.X_ORIGIN_VERIFY_HEADER as string,
});
