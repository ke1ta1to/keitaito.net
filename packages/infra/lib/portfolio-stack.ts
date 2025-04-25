import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubRepositoryName = "ke1ta1to/keitaito.net";
    const roleName = "PortfolioNextjsRole";

    const repository = new ecr.Repository(this, "PortfolioRepository", {
      repositoryName: "portfolio-nextjs",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
    });

    const role = new iam.Role(this, "PortfolioNextjsRole", {
      assumedBy: new iam.FederatedPrincipal(
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:${githubRepositoryName}:*`,
          },
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      roleName: roleName,
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ecr:GetAuthorizationToken"],
        resources: ["*"],
      }),
    );

    // ecrにpushするため
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ecr:*"],
        resources: [repository.repositoryArn],
      }),
    );

    new cdk.CfnOutput(this, "RepositoryArn", {
      exportName: "RepositoryArn",
      value: repository.repositoryArn,
    });

    new cdk.CfnOutput(this, "RoleArn", {
      value: role.roleArn,
    });
  }
}
