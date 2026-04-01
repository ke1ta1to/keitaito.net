#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { AppStack } from "./app-stack";

const app = new cdk.App();

new AppStack(app, "Blog", {
  githubRepository: "ke1ta1to/keitaito.net",
});
