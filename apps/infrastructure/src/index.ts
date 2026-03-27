#!/usr/bin/env node
import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import { AppStack } from "./app-stack";

const app = new cdk.App();

new AppStack(app, "Blog", {
  distDir: path.join(__dirname, "../../blog/.open-next/"),
});
