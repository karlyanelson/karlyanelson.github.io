---
lastUpdated: 2024-09-20
tags: post
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
