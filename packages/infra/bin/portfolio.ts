#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";

import { PortfolioAppStack } from "../lib/portfolio-app-stack";
import { PortfolioStack } from "../lib/portfolio-stack";

dotenv.config();

const app = new cdk.App();
new PortfolioStack(app, "PortfolioStack");

new PortfolioAppStack(app, "PortfolioAppStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  certificateArn: process.env.CERTIFICATE_ARN || "",
  customDomainName: process.env.CUSTOM_DOMAIN_NAME || "",
  hostedZoneDomainName: process.env.HOSTED_ZONE_DOMAIN_NAME || "",
});
