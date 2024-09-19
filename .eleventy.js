const htmlmin = require("html-minifier-terser");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTOC = require("eleventy-plugin-toc");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const now = String(Date.now());

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./styles/tailwind.config.js");
  eleventyConfig.addWatchTarget("./styles/tailwind.css");

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.js": "./js/alpine.js",
  });

  eleventyConfig.addPassthroughCopy({ "./favicon": "/" });

  eleventyConfig.addPassthroughCopy("./_redirects");
  eleventyConfig.addPassthroughCopy("./functions");
  eleventyConfig.addPassthroughCopy("netlify.toml");

  eleventyConfig.addShortcode("version", function () {
    return now;
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // syntax highlighting for code blocks in markdown files
  eleventyConfig.addPlugin(syntaxHighlight);

  // Table of contents
  // Add anchor links to headings
  eleventyConfig.setLibrary("md", markdownIt().use(markdownItAnchor));
  // automatically generates table of contents based on heading links
  eleventyConfig.addPlugin(pluginTOC);
};
