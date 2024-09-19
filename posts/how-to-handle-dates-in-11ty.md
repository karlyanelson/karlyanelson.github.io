---
layout: post.njk
tags: post
title: How to handle dates in 11ty
date: Last Modified
draft: true
techStack:
  - name: "@11ty/eleventy"
    version: 2.0
    url: https://www.11ty.dev/docs/
  - name: Nunjucks
    version: null
    url: https://www.11ty.dev/docs/languages/nunjucks/
  - name: YAML
    version: null
    url: https://learnxinyminutes.com/docs/yaml/
---

## The Problem

You want to show the last modified date of a post (or item in any collection) without having to remember to edit it manually every time.

## Solution Summary

Use "Last Modified" for you date in your [frontmatter](https://www.11ty.dev/docs/data-frontmatter/).

```yaml
date: Last Modified
```

## The Explanation

In 11ty collection

I use [YAML syntax](https://learnxinyminutes.com/docs/yaml/). You can use (other formats too)[https://www.11ty.dev/docs/data-frontmatter/#alternative-front-matter-formats].
