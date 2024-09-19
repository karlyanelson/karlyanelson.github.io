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

### Update frontmatter

In your 11ty collection item, update the `date` in your frontmatter. For example, the frontmatter of this post (posts/how-to-handle-dates-in-11ty.md) is:

```yaml
---
layout: post.njk
tags: post
title: How to handle dates in 11ty
date: Last Modified
draft: true
---
## A heading
The content of your post goes here...
```

I use [YAML syntax](https://learnxinyminutes.com/docs/yaml/). You can use (other formats too)[https://www.11ty.dev/docs/data-frontmatter/#alternative-front-matter-formats].

### Use in pages

You can then use the date in pages or layouts.

For example, in my `posts/index.njk` page I have a list of posts:

{% raw %}

```html
{%- for post in collections.post -%}
<li class="my-6">
  <a href="{{ post.url }}">
    <h2>{{ post.data.title }}</h2>
    <p>Last updated: {{ post.date }}</p>
  </a>
</li>
{%- endfor -%}
```

{% endraw %}

and I show the date in my `_includes/post.njk` Post page layout:

{% raw %}

```html
<article>
  <h1>{{title}}</h1>
  <p>Last updated: {{page.date}}</p>
  <div>{{ content | safe }}</div>
</article>
```

{% endraw %}

### Format date

This shows up as `Thu Sep 19 2024 08:38:16 GMT-0500 (Central Daylight Time)`. You might want a shorter date or to format it differently.
