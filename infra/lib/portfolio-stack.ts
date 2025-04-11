import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, "PortfolioRepository", {
      repositoryName: "portfolio-nextjs",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
    });

    const bucket = new s3.Bucket(this, "PortfolioBucket", {
      bucketName: `portfolio-nextjs-static-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new cdk.CfnOutput(this, "RepositoryArn", {
      exportName: "RepositoryArn",
      value: repository.repositoryArn,
    });

    new cdk.CfnOutput(this, "BucketArn", {
      exportName: "BucketArn",
      value: bucket.bucketArn,
    });
  }
}
