---
tags: post
emoji: 🎩
title: Pass in CSS Variables through a <style> tag
description: Be able to pass in CSS variable values through a inline style tag on an element. Useful for Squarespace code blocks.
techStack:
  - name: CSS
    version: null
    url: null
---

## The Problem

I had several custom code blocks in Squarespace, all using the same classes, just different images and different colored overlays. I wanted an easy way to pass in the overlay color.

## The Solution

Pass in the css variables in the element `style` tag, like so:

```html
<div style="--bgColor:blue; --textColor:white">I'm a div</div>
```

and use it like so:

```css
div {
  background-color: var(--bgColor);
  color: var(--textColor);
}
```

## Example

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="YzomBxj" data-pen-title="Pass in css variable in style tag" data-user="karlyanelson" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/karlyanelson/pen/YzomBxj">
  Pass in css variable in style tag</a> by Karly Nelson (<a href="https://codepen.io/karlyanelson">@karlyanelson</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
