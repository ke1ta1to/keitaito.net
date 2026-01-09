#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { PortfolioStack } from "../lib/portfolio-stack";
import z from "zod";

const app = new cdk.App();

const EnvironmentContextSchema = z.enum(["dev", "prod"]);

const envName = EnvironmentContextSchema.parse(app.node.tryGetContext("env"));

switch (envName) {
  case "dev":
    new PortfolioStack(app, "portfolio-dev", {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });
    break;
  case "prod":
    new PortfolioStack(app, "portfolio-prod", {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });
    break;
}
