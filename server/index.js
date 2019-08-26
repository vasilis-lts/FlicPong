const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/Api/GetPlayers", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let db = new sqlite3.Database("src/db/pingpong.db", err => {
    if (err) {
      res.send(err);
    } else {
      db.all("SELECT * FROM Players", [], function(err, rows) {
        if (err) {
          res.send(err);
        } else {
          res.send(rows);
        }
        db.close();
      });
    }
  });
});

app.post("/Api/Save2v2Match", function(req, res) {
  const rb = req.body;
  res.setHeader("Content-Type", "application/json");
  let db = new sqlite3.Database("src/db/pingpong.db", err => {
    if (err) {
      res.send(err);
    } else {
      db.serialize(function() {
        db.run(
          `INSERT INTO Matches2v2 (Player1Team1, Player2Team1, Player1Team2, Player2Team2) VALUES (${rb.Player1Team1Id},${rb.Player2Team1Id},${rb.Player1Team2Id},${rb.Player2Team2Id})`,
          function(err) {
            if (err) {
              res.send(err);
            } else {
              rb.MatchId = this.lastID;
              res.send(rb);
            }
          }
        );
      });

      db.close();
    }
  });
});

app.post("/Api/UpdatePlayersWins", function(req, res) {
  const rb = req.body;

  console.log(rb);
  res.setHeader("Content-Type", "application/json");
  let db = new sqlite3.Database("src/db/pingpong.db", err => {
    if (err) {
      res.send(err);
    } else {
      for (let i = 0; i < rb.length; i++) {
        db.serialize(function() {
          console.log(rb[i]);
          // Update GamesPlayed
          db.run(
            `UPDATE Players SET GamesPlayed = GamesPlayed + 1 WHERE Id = ${rb[i].PlayerId}`,
            function(err) {
              if (err) {
                res.send(err);
              } else {
                // console.log(
                //   `Player: ${rb[i].PlayerId} games played updated successfully! `
                // );
              }
            }
          );
          // Update Wins
          if (rb[i].Win) {
            db.run(
              `UPDATE Players SET Wins = Wins + 1 WHERE Id = ${rb[i].PlayerId}`,
              function(err) {
                if (err) {
                  res.send(err);
                } else {
                  console.log(
                    `Player: ${rb[i].PlayerId} wins updated successfully! `
                  );
                }
              }
            );
          }
        });
      }

      res.send({ message: "Players table updated" });

      db.close();
    }
  });
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
