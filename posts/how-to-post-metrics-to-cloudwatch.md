---
lastUpdated: 2024-10-01
tags: post
emoji: 🐑
title: How to easily post custom metrics to Cloudwatch from a Lambda
description: If you want to easily generate custom AWS Cloudwatch metrics in AWS Lambda functions without having to do a bunch of custom code or batching.
techStack:
  - name: AWS Lambda
    version: null
    url: https://aws.amazon.com/lambda/
  - name: AWS Cloudwatch
    version: null
    url: https://aws.amazon.com/cloudwatch/
  - name: aws-embedded-metrics-node
    version: 4.1
    url: https://github.com/awslabs/aws-embedded-metrics-node
---

## The Problem

You want to easily generate custom metrics in Lambda functions without having to do a bunch of custom code or batching.

## Solution Summary

Use [aws-embedded-metrics-node](https://github.com/awslabs/aws-embedded-metrics-node) package

## The Explanation

If you are running on Lambda,

1. Bring in the "aws-embedded-metrics" package
2. Export your function wrapped in `metricScope()`
3. Use the `metrics` from `metricScope` to
   - Set the dimensions
   - Set the namespace
   - Then start logging your metrics with `putMetric`

```js
import { metricScope, Unit, StorageResolution } from "aws-embedded-metrics";

const myFunc = metricScope((metrics) => async () => {
  metrics.setDimensions({ Service: "Aggregator" });
  metrics.setNamespace("custom/namespace");

  // ...do the thing, get the data

  metrics.putMetric(
    "ProcessingLatency",
    100,
    Unit.Milliseconds,
    StorageResolution.Standard
  );

  return { status: 200, data };
});

exports.handler = myFunc;
```

> **Note:** When using `setDimensions` or `putDimensions` - [WARNING](https://github.com/awslabs/aws-embedded-metrics-node#metriclogger): Every distinct value will result in a new CloudWatch Metric. If the cardinality of a particular value is expected to be high, you should consider using setProperty instead.

## Extra Credit: Post Metrics inside an ECS Task container

This works out of the box for Lambda - they run Cloudwatch Agent on your behalf. However, if you want to use `aws-embedded-metrics-node` in an ECS task container to send embedded metrics format (EMF) logs to Cloudwatch as metrics, you need to add an [AWS Cloudwatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) container as a sidecar in the same ECS task.

### Details

1. Grab the Cloudwatch Agent image for your sidecar container from here: https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent
2. Add port `25888` to your Cloudwatch Agent sidecar container - it's the default.
3. Create a `aws_iam_policy` with the name `CloudWatchAgentServerPolicy` and add its arn to your ECS Task `resource "aws_iam_role_policy_attachment" "task_execution"` and `resource "aws_iam_role_policy_attachment" "task"`
4. Add `CW_CONFIG_CONTENT` environment variable with value of `{"logs" : {"metrics_collected" : {"emf" : {}}}}` to your sidecar container
5. Add `AWS_EMF_LOG_GROUP_NAME` environment variable with a value of the sidecar log group name to your application container.

### ECS Task Container defintions example

Here is a [Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) example of how to put your application container and Cloudwatch Agent sidecar container in the same ECS task definition:

```tf
resource "aws_ecs_task_definition" "main" {
  family                   = "mycooltaskfamily"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = local.task_execution_role_arn
  task_role_arn            = local.task_role_arn
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  container_definitions = jsonencode(
    [
      {
        name         = "cloudwatchagent",
        image        = "public.ecr.aws/cloudwatch-agent/cloudwatch-agent:1.300037.1b602",
        cpu          = 256,
        memory       = 512,
        essential    = false,
        portMappings = [{ containerPort = 25888 }],
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.sidecar_logs.name
            awslogs-region        = local.aws_region_name
            awslogs-stream-prefix = "all"
          }
        },
        environment = [
          { name = "CW_CONFIG_CONTENT", value = jsonencode(
            {
              "logs" : {
                "metrics_collected" : {
                  "emf" : {}
                }
              }
            }
          ) }
        ]
      },
      {
        name      = "mycoolapplication",
        image     = local.task_image_url,
        cpu       = 256,
        memory    = 512,
        essential = true,
        portMappings = [
          {
            containerPort = 3000
          }
        ],
        logConfiguration = {
          logDriver = "awslogs",
          options = {
            awslogs-group         = aws_cloudwatch_log_group.application_logs.name,
            awslogs-region        = local.aws_region_name,
            awslogs-stream-prefix = "all"
          }
        },
        environment = concat([
          {
            name  = "AWS_EMF_LOG_GROUP_NAME",
            value = aws_cloudwatch_log_group.sidecar_logs.name
          }]
        )
      }
  ])
}
```
