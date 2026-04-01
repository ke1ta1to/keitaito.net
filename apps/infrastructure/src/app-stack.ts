import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
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
    this.createEcrRepository();
    this.createEc2();
  }

  private createEcrRepository() {
    this.ecrRepository = new ecr.Repository(this, "BlogImageRepository", {
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
    this.ecrRepository.grantPullPush(githubActionsRole);

    new cdk.CfnOutput(this, "RepositoryUri", {
      value: this.ecrRepository.repositoryUri,
    });

    new cdk.CfnOutput(this, "GitHubActionsRoleArn", {
      value: githubActionsRole.roleArn,
    });
  }

  private createEc2() {
    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, "Ec2SecurityGroup", {
      vpc,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));

    const instanceRole = new iam.Role(this, "Ec2InstanceRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });
    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonSSMManagedInstanceCore",
      ),
    );
    this.ecrRepository.grantPull(instanceRole);

    const instance = new ec2.Instance(this, "Ec2Instance", {
      vpc,
      securityGroup,
      role: instanceRole,
      requireImdsv2: true,
      machineImage: ec2.MachineImage.latestAmazonLinux2023({
        cpuType: ec2.AmazonLinuxCpuType.ARM_64,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO,
      ),
      keyPair: ec2.KeyPair.fromKeyPairName(this, "Ec2KeyPair", "ec2-key-pair"),
    });

    instance.addUserData(
      "yum update -y",
      "yum install -y docker",
      "systemctl enable docker",
      "systemctl start docker",
      "usermod -aG docker ec2-user",
    );

    const eip = new ec2.CfnEIP(this, "ElasticIp", {
      domain: "vpc",
      instanceId: instance.instanceId,
    });

    new cdk.CfnOutput(this, "ElasticIpAddress", {
      value: eip.ref,
    });
  }
}
