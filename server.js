// Using connect
// See docs at http://www.senchalabs.org/connect/

let connect = require("connect");
let serveStatic = require("serve-static");
// let path = require("path");
let server;
let app;

function logger(request, response, next) {
  next();
}

function handleIndex(request, response) {
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.write("Hello World! " + new Date().toISOString());
  response.end();
}

function onListening() {
  console.log("Server running at http://localhost:4000/");
}

app = connect();
app.use(logger);
// app.use(serveStatic(path.join(__dirname, "/public")));
app.use(serveStatic(__dirname));
app.use("/", handleIndex);
server = app.listen(4000, onListening);
