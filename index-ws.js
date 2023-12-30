const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("/index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Server is lightening on port 3000");
});

// WebSocket
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server });

process.on("SIGINT", () => {
  console.log("sigint");
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};

wss.on("connection", function connection(ws) {
  const clients = wss.clients.size;
  console.log(`New connection, total clients:  ${clients}`);

  wss.broadcast(`Current visitors:  ${clients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  db.run(`
      INSERT INTO visitors (count, time)
      VALUES (${clients}, datetime('now'))
  `);

  ws.on("close", function close() {
    console.log(`Disconnected, total clients:  ${clients}`);
  });
});
// end WebSocket

// SQL
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors
    (
      count INTEGER,
      time TEXT
    )
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  db.close();
}

// end SQL
