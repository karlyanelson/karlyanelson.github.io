---
draft: true
tags: post
emoji: 🪣
title: How to deploy s3 static website hosted with cloudfront cdn
description: If you want to easily generate custom AWS Cloudwatch metrics in AWS Lambda functions without having to do a bunch of custom code or batching.
techStack:
  - name: AWS S3
    version: null
    url: https://aws.amazon.com/s3/
  - name: AWS Cloudfront CDN
    version: null
    url: https://aws.amazon.com/cloudfront/
---

## Using Terraform:

### The full terraform

```jsx
resource "aws_s3_bucket" "main" {
  bucket = var.name
}

resource "aws_s3_bucket_website_configuration" "main" {
  bucket = aws_s3_bucket.main.bucket

  index_document {
    suffix = "index.html"
  }
}
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_logging" "main" {
  bucket = aws_s3_bucket.main.bucket

  target_bucket = var.log_bucket_name
  target_prefix = "docs/"
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "docs cdn OAI"
}

resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id
  policy = data.aws_iam_policy_document.main.json
}

data "aws_iam_policy_document" "main" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.main.arn,
      "${aws_s3_bucket.main.arn}/*",
    ]
  }
}

resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.main.website_endpoint
    origin_id   = aws_s3_bucket.main.id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [var.aliases]

  default_cache_behavior {
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
    allowed_methods            = ["HEAD", "GET", "OPTIONS"]
    cached_methods             = ["HEAD", "GET", "OPTIONS"]
    target_origin_id           = aws_s3_bucket.main.id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  logging_config {
    include_cookies = false
    bucket          = var.log_bucket_url
    prefix          = "docscdn/"
  }

  viewer_certificate {
    minimum_protocol_version = "TLSv1.2_2021"
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
  }
}

resource "aws_cloudfront_response_headers_policy" "security" {
  name = "docs-security-headers"

  security_headers_config {
    frame_options {
      frame_option = "DENY"
      override     = true
    }
  }
}
```

### Details

If you just do a regular s3 bucket frontend by cloudfront, you get an error where you can’t get to sub pages directly - shows a not found error in xml. You have to go to `website.com/page/index.html` directly, for example.

Learn more here: [S3 Website + CloudFront - how to show index.html content when at /sub-directory/ path](https://gist.github.com/zulhfreelancer/24f73015c5437281f3b98c3cb34ea225)

To get it to work you need to:

- enable Static website hosting for s3 bucket
- change s3 bucket policy to `\*` (`aws_iam_policy_document`)
- turn off blocking public access
- point cloudfront domain to s3 generated website url instead of bucket arn

The way to do that in terraform is above, the main bits being:

```jsx
resource "aws_s3_bucket_website_configuration" "main" {
  bucket = aws_s3_bucket.main.bucket

  index_document {
    suffix = "index.html"
  }
}
```

to turn on static website hosting for the bucket

```jsx
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
```

to make the website publicly accessible and to point cloudfront to your s3 hosted site.

```jsx
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.main.website_endpoint
    origin_id   = aws_s3_bucket.main.id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }
```

Make sure you use `aws_s3_bucket_website_configuration`'s website_endpoint, and not the bucket. Otherwise will get [this issue](https://github.com/hashicorp/terraform-provider-aws/issues/13393)

### About `custom_origin_config`

Need `custom_origin_config` or it assumes you mean to point to an s3 bucket. Those are the default ports. S3 static website hosting requires the `http-only` protocol

Docs on default values for cloudfront `custom_origin_config`

[https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginProtocolPolicy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginProtocolPolicy)

`origin_protocol_policy`

> HTTP only is the default setting when the origin is an Amazon S3 static website hosting endpoint, because Amazon S3 doesn’t support HTTPS connections for static website hosting endpoints. The CloudFront console does not support changing this setting for Amazon S3 static website hosting endpoints.

`http_port`

> Port 80 is the default setting when the origin is an Amazon S3 static website hosting endpoint, because Amazon S3 only supports port 80 for static website hosting endpoints. The CloudFront console does not support changing this setting for Amazon S3 static website hosting endpoints.

`https_port`

> Optional. The HTTPS port that the custom origin listens on. Valid values include ports 80, 443, and 1024 to 65535. The default value is port 443. When Protocol is set to HTTP only, you cannot specify a value for HTTPS port.

`origin_ssl_protocols`

> Choose the minimum TLS/SSL protocol that CloudFront can use when it establishes an HTTPS connection to your origin. Lower TLS protocols are less secure, so we recommend that you choose the latest TLS protocol that your origin supports. When Protocol is set to HTTP only, you cannot specify a value for Minimum origin SSL protocol.
>
> If you use the CloudFront API to set the TLS/SSL protocol for CloudFront to use, you cannot set a minimum protocol. Instead, you specify all of the TLS/SSL protocols that CloudFront can use with your origin. For more information, see [OriginSslProtocols](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_OriginSslProtocols.html) in the _Amazon CloudFront API Reference_.

## Using the AWS Console

More detail coming soon, but here's the high level:

1. Make s3 bucket - make it private
2. Put your static website files in your s3 budket
3. Make cloudflare cdn
   1. connect it to your s3 bucket
   2. use OAC permissions or something
4. Make cloudflare instance
   1. Let instance finish deploying
   2. Once it’s finished deploying, grab the link to the instance
   3. Go to your instance, and voila, there’s the contents of your s3 bucket
