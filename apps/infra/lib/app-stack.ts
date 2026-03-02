import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib/core";
import type { Construct } from "constructs";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new apiGateway.RestApi(this, "Api", {
      restApiName: `${id}Api`,
    });

    restApi.root.addMethod(
      "GET",
      new apiGateway.MockIntegration({
        requestTemplates: {
          "application/json": JSON.stringify({ statusCode: 200 }),
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseTemplates: {
              "application/json": JSON.stringify({ ok: true }),
            },
            responseParameters: {
              "method.response.header.Content-Type": "'application/json'",
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Content-Type": true,
            },
          },
        ],
      },
    );
  }
}
