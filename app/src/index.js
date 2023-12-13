const fs = require("fs");
const http = require("http");
const { join } = require("path");

const { createNewUser } = require("./users");

const host = "localhost";
const port = 1234;

/**
 * @param {typeof import("http").IncomingMessage} request
 * @param {typeof import("http").ServerResponse} response
 * @returns {void}
 * */
function router(request, response) {
  switch (request.url) {
    case "/users":
      switch (request.method) {
        case "POST":
          // TODO: Create user
          response.writeHead(201);
          response.end("Create User");
          break;
        case "GET":
          const users = Array.from({ length: 3 }, createNewUser);

          response.setHeader("Content-Type", "application/json");
          response.writeHead(200);
          response.end(JSON.stringify({ users }));
          break;
      }
      break;
    case "/":
      switch (request.method) {
        case "GET":
          const fileBuffer = fs.readFileSync(
            join(__dirname, "assets", "index.html"),
            {},
          );
          response.setHeader("Content-Type", "text/html");
          response.writeHead(200);
          response.end(fileBuffer);
          break;
      }
      break;
    default:
      response.writeHead(404);
      response.end("404 Not Found.");
  }
}

const server = http.createServer(router);
server.listen(port, host, () => {
  console.log(`HTTP server running on http://${host}:${port}`);
});
