---
layout: post.njk
tags: post
title: How to handle dates in Eleventy (11ty)
date: Last Modified
draft: true
techStack:
  - name: Eleventy (11ty)
    version: 2.0
    url: https://www.11ty.dev/docs/
  - name: Nunjucks
    version: null
    url: https://mozilla.github.io/nunjucks/templating.html
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

> Note that for looping through a collection list we use `post.data`.

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

> Note that for a template layout we use `page.date` instead of just `date`. [See 11ty docs](https://www.11ty.dev/docs/dates/#setting-a-content-date-in-front-matter)

### Format date

This shows up as `Thu Sep 19 2024 08:38:16 GMT-0500 (Central Daylight Time)`. You might want a shorter date or to format it differently.

In our `_includes/post.njk` Post page layout, where we're using `page.date`, we can call Javascript methods on the output like {% raw %}`{{page.date.toLocaleString()}}`{%endraw%}. This only works in Nunjucks though, not Liquid[See Docs](https://www.11ty.dev/docs/dates/#example). "You could add your own `toUTCString` [filter in Liquid](https://www.11ty.dev/docs/filters/) to perform the same task."

In `_includes/post.njk`:
{% raw %}

```html
<article>
  <h1>{{title}}</h1>
  <p>Last updated: {{page.date.toLocaleString()}}</p>
  <div>{{ content | safe }}</div>
</article>
```

{% endraw %}

If we use `toLocaleString()` our date `Thu Sep 19 2024 08:38:16 GMT-0500 (Central Daylight Time)` will become `9/19/2024, 9:40:51 AM`.

You can pass options to [toLocalString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) to change how you want it formatted - like if you want it to show the time or not.

#### Example toLocalString formatting

If we want our date formatted like `September 19, 2024`, we'd pass in the options:

```js
{
    year: 'numeric',
    month:'long',
    day: 'numeric'
}
```

In `_includes/post.njk`:
{% raw %}

```js
<p>
  Last updated: {{page.date.toLocaleString( "en-US", { year: 'numeric', month:
  'long', day: 'numeric' })}}
</p>
```

{% endraw %}

In `posts/index.njk`:

{% raw %}

```js
{%- for post in collections.post -%}
    <li class="my-6">
    <a href="{{ post.url }}">
        <h2>{{ post.data.title }}</h2>
        <p>
        Last updated: {{post.date.toLocaleString( "en-US", { year: 'numeric',
        month: 'long', day: 'numeric' })}}
        </p>
    </a>
    </li>
{%- endfor -%}
```

{% endraw %}

### Make custom filter to use same formatting options across pages

This works in both places, but since we're using the same `toLocaleString( "en-US", { year: 'numeric',month: 'long', day: 'numeric' })` options in multiple places, it'd probably make more sense to make our own date [filter](https://www.11ty.dev/docs/filters/).

In our `.eleventy.js` at the root of our 11ty project, we're going to use the `addFilter` function, like this:

```js
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // put your other configurations and functions alongside this one inside of `module.exports`
  // there can only be one `module.exports` inside of `.eleventy.js`
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
};
```
