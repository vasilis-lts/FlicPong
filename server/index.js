const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const initSqlJs = require("./sql-wasm.js");
const filebuffer = fs.readFileSync("server/db/pingpong.db");
const WebSocket = require("ws");

let socket;
////////////////////////////////

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", ws => {
  console.log("Server socket open");
  socket = ws;
});

///////////////////////////////

const ButtonActions = {
  SinglePress: "SinglePress",
  DoublePress: "DoublePress",
  Hold: "Hold"
};

var app = express();
// app.listen(3001, "0.0.0.0", function() {
//   console.log("Listening to port:  " + 3001);
// });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));

app.get("/Api/GetPlayers", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  initSqlJs().then(function(SQL) {
    // Load the db
    const db = new SQL.Database(filebuffer);

    var contents = db.prepare("SELECT * FROM Players");
    for (var result = []; contents.step(); )
      result.push(contents.getAsObject());

    if (result && result.length) {
      res.send(result);
    } else {
      res.send(["Error getting players"]);
    }
    db.close();
  });
});

app.post("/Api/FlicClick", function(req, res) {
  const message = "Flic button pressed!";
  const rb = req.body;
  res.setHeader("Content-Type", "application/json");
  const responseBody = {
    buttonId: rb.buttonId,
    buttonAction: ButtonActions.SinglePress
  };
  console.log(responseBody);

  socket.send(JSON.stringify(responseBody));
});

app.post("/Api/FlicDoubleClick", function(req, res) {
  const message = "Flic button double pressed!";
  const rb = req.body;
  res.setHeader("Content-Type", "application/json");

  const responseBody = {
    buttonId: rb.buttonId,
    buttonAction: ButtonActions.DoublePress
  };
  console.log(responseBody);

  socket.send(JSON.stringify(responseBody));
});

app.post("/Api/FlicHold", function(req, res) {
  const rb = req.body;
  res.setHeader("Content-Type", "application/json");

  const responseBody = {
    buttonId: rb.buttonId,
    buttonAction: ButtonActions.Hold
  };
  console.log(responseBody);

  socket.send(JSON.stringify(responseBody));
  // res.send(responseBody);
});

// app.get("/Api/FlicClick", function(req, res) {
//   const message = "Flic button pressed!";
//   res.setHeader("Content-Type", "application/json");
//   socket.send(message);
//   console.log(message);
//   res.send({ message });
// });

// app.post("/Api/Save2v2Match", function(req, res) {
//   const rb = req.body;
//   res.setHeader("Content-Type", "application/json");
//   let db = new sqlite3.Database(
//     "https://pingpongdatabase.000webhostapp.com/db/pingpong.db",
//     err => {
//       if (err) {
//         res.send(err);
//       } else {
//         db.serialize(function() {
//           db.run(
//             `INSERT INTO Matches2v2 (Player1Team1, Player2Team1, Player1Team2, Player2Team2) VALUES (${rb.Player1Team1Id},${rb.Player2Team1Id},${rb.Player1Team2Id},${rb.Player2Team2Id})`,
//             function(err) {
//               if (err) {
//                 res.send(err);
//               } else {
//                 rb.MatchId = this.lastID;
//                 res.send(rb);
//               }
//             }
//           );
//         });

//         db.close();
//       }
//     }
//   );
// });

// app.post("/Api/UpdatePlayers2v2Wins", function(req, res) {
//   const rb = req.body;

//   console.log(rb);
//   res.setHeader("Content-Type", "application/json");
//   let db = new sqlite3.Database("src/db/pingpong.db", err => {
//     if (err) {
//       res.send(err);
//     } else {
//       for (let i = 0; i < rb.length; i++) {
//         db.serialize(function() {
//           console.log(rb[i]);
//           // Update GamesPlayed
//           db.run(
//             `UPDATE Players SET GamesPlayed = GamesPlayed + 1 WHERE Id = ${rb[i].PlayerId}`,
//             function(err) {
//               if (err) {
//                 res.send(err);
//               } else {
//                 // console.log(
//                 //   `Player: ${rb[i].PlayerId} games played updated successfully! `
//                 // );
//               }
//             }
//           );
//           // Update 2v2 Wins
//           if (rb[i].Win) {
//             db.run(
//               `UPDATE Players SET Wins2v2 = Wins2v2 + 1 WHERE Id = ${rb[i].PlayerId}`,
//               function(err) {
//                 if (err) {
//                   res.send(err);
//                 } else {
//                   console.log(
//                     `Player: ${rb[i].PlayerId} 2v2 wins updated successfully! `
//                   );
//                 }
//               }
//             );
//           }
//         });
//       }

//       res.send({ message: "Players table updated" });

//       db.close();
//     }
//   });

// });

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
