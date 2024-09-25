const htmlmin = require("html-minifier-terser");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTOC = require("eleventy-plugin-toc");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const now = String(Date.now());

module.exports = function (eleventyConfig) {
  // CSS
  eleventyConfig.addWatchTarget("./styles/tailwind.config.js");
  eleventyConfig.addWatchTarget("./styles/tailwind.css");

  // Alpine JS
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.js": "./js/alpine.js",
  });

  // Favicon
  eleventyConfig.addPassthroughCopy({ "./favicon": "/" });

  // Images
  eleventyConfig.addPassthroughCopy({ "./images": "./images" });

  // Netlify Functions
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
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor));
  // automatically generates table of contents based on heading links
  eleventyConfig.addPlugin(pluginTOC);

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return dateObj.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("postDateShort", (dateObj) => {
    return dateObj.toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  });

  // //// Don't show drafts in production https://www.11ty.dev/docs/quicktips/draft-posts/
  // // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
  // eleventyConfig.addGlobalData(
  //   "eleventyComputed.eleventyExcludeFromCollections",
  //   function () {
  //     return (data) => {
  //       // Always exclude from non-watch/serve builds
  //       if (data.draft && !process.env.BUILD_DRAFTS) {
  //         return true;
  //       }

  //       return data.eleventyExcludeFromCollections;
  //     };
  //   }
  // );

  // eleventyConfig.on("eleventy.before", ({ runMode }) => {
  //   // Set the environment variable
  //   if (runMode === "serve" || runMode === "watch") {
  //     process.env.BUILD_DRAFTS = true;
  //   }
  // });
};
