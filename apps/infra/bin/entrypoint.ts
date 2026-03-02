#!/usr/bin/env node

import * as cdk from "aws-cdk-lib/core";

import { AppStack } from "../lib/app-stack.js";

const app = new cdk.App();

const environment = app.node.tryGetContext("env") || "dev";

if (environment === "prod") {
  new AppStack(app, "BlogProduction");
} else if (environment === "stg") {
  new AppStack(app, "BlogStaging");
} else if (environment === "dev") {
  new AppStack(app, "BlogDevelopment");
} else {
  throw new Error(`Unknown environment: ${environment}`);
}
