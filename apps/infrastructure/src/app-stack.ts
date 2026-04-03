import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export interface AppStackProps extends cdk.StackProps {
  githubRepository: string;
}

export class AppStack extends cdk.Stack {
  props: AppStackProps;
  ecrRepository: ecr.Repository;

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    this.props = props;
    this.ecrRepository = this.createEcrRepository();
  }

  private createEcrRepository(): ecr.Repository {
    const repository = new ecr.Repository(this, "BlogImageRepository", {
      repositoryName: "blog",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
      imageTagMutability: ecr.TagMutability.IMMUTABLE,
      lifecycleRules: [{ maxImageCount: 30 }],
    });

    const githubActionsRole = new iam.Role(this, "GitHubActionsEcrPushRole", {
      roleName: "blog-ecr-push-role",
      assumedBy: new iam.OpenIdConnectPrincipal(
        iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          "GitHubOidcProvider",
          `arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com`,
        ),
      ).withConditions({
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": `repo:${this.props.githubRepository}:ref:refs/heads/main`,
        },
      }),
    });
    repository.grantPullPush(githubActionsRole);

    new cdk.CfnOutput(this, "RepositoryUri", {
      value: repository.repositoryUri,
    });

    new cdk.CfnOutput(this, "GitHubActionsRoleArn", {
      value: githubActionsRole.roleArn,
    });

    return repository;
  }
}
