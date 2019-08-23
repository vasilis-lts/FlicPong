const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/Api/GetPlayers", (req, res) => {
  let db = new sqlite3.Database("src/db/pingpong.db", err => {
    let _res = res;
    if (err) {
      console.error(err.message);
    } else {
      db.all("SELECT * FROM Players", [], function(err, rows) {
        if (err) {
          console.log(err);
        } else {
          _res.setHeader("Content-Type", "application/json");
          _res.send(rows);
        }
        db.close();
      });
    }
  });
});

app.post("/Api/Save2v2Match", function(req, res) {
  console.log(req.body);
  const rb = req.body;
  let db = new sqlite3.Database("src/db/pingpong.db", err => {
    if (err) {
      console.error(err.message);
    } else {
      db.run(
        `INSERT INTO Matches2v2 (Player1Team1, Player2Team1, Player1Team2, Player2Team2) VALUES (${
          rb.Player1Team1Id
        },${rb.Player2Team1Id},${rb.Player1Team2Id},${rb.Player2Team2Id})`
      );

      db.close();
    }
  });
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
