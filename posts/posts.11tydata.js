let data = {
  layout: "layouts/post.njk",
};

if (process.env.NODE_ENV === "production") {
  data.date = "git Created";
}

module.exports = data;
