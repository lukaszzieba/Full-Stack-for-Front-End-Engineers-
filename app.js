const http = require("http");

http
  .createServer(function (req, res) {
    res.write("It works!");
    res.end();
  })
  .listen(3000);

console.log("Server is lightening on port 3000");
