---
layout: post.njk
tags: post
title: How to escape code in Markdown in Eleventy (11ty)
description: Be able to show Liquid code in Markdown in Eleventy without it compiling
date: Last Modified
techStack:
  - name: Eleventy (11ty)
    version: 2.0
    url: https://www.11ty.dev/docs/
  - name: Liquid
    version: null
    url: https://shopify.dev/docs/api/liquid/
  - name: Markdown
    version: null
    url: https://www.markdownguide.org/
---

## The Problem

In my ["How to handle dates in 11ty"](/posts/how-to-handle-dates-in-11ty/) article I wanted to show some of my 11ty code in [Markdown](https://www.markdownguide.org/), but it tried to compile things like {% raw %}`{{content}}`{% endraw %} and actually put content in there.

## Solution Summary

Wrap your code in the `raw` tag. [See Liquid Docs.](https://shopify.dev/docs/api/liquid/tags/raw)

## Explanation

Eleventy's default `markdownTemplateEngine` is [Liquid](https://shopify.dev/docs/api/liquid/), and Liquid has a tag you can use called [raw](https://shopify.dev/docs/api/liquid/tags/raw) that "outputs any Liquid code as text instead of rendering it."

Ironically you can't wrap a `raw` tag in another `raw` tag so the only way for me to show the full code was to use a [Github Gist](https://gist.github.com/):

<script src="https://gist.github.com/karlyanelson/4c3e701e7d8c604f0af3bc38ba5fb44f.js"></script>
