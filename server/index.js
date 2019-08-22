const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());

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

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
