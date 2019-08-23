import React, { useEffect, useState } from "react";
import thefuckingplantImage from "../assets/images/the_fucking_plant.png";
import "../App.scss";
import Modal from "../components/Modal";
import { Link } from "react-navi";
import Audio from "../audio/AudioController";
import Api from "../helperFunctions";
import appSettings from "../appSettings";

function TeamRandomizer(props) {
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [MatchStarted, setMatchStarted] = useState(false);

  useEffect(() => {
    randomizeTeams();
  }, []);

  async function randomizeTeams() {
    const players = await Api.get(appSettings.endpoints.GetPlayers);

    const numberOfPlayers = players.length;
    const team1 = [];
    const team2 = [];
    setTeam1([]);
    setTeam2([]);

    setTimeout(() => {
      do {
        let randomIndex = Math.floor(Math.random() * players.length);
        if (players.length > numberOfPlayers / 2) {
          team1.push(players[randomIndex]);
        } else {
          team2.push(players[randomIndex]);
        }
        players.splice(randomIndex, 1);
      } while (players.length > 0);

      setTeam1(team1);
      setTeam2(team2);
    }, 3000);
  }

  const AcceptTeams = () => {
    setMatchStarted(true);
    const postBody = prep2v2MatchBody();

    fetch(appSettings.endpoints.Save2v2Match, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postBody)
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const prep2v2MatchBody = () => {
    return {
      Player1Team1Id: team1[0].Id,
      Player2Team1Id: team1[1].Id,
      Player1Team2Id: team2[0].Id,
      Player2Team2Id: team2[1].Id
    };
  };

  return (
    <div className="TeamRandomizer screen">
      <Link href="/main" className="nav-link main-menu-link mt1">
        {`<- Back to main menu`}
      </Link>
      <div className="flex">
        <div className="team-title red">
          <h1>Team !Plant</h1>
        </div>
        <div className="team-title green">
          <h1>Team Plant</h1>
        </div>
      </div>
      <div className="teams-container">
        <div className="flex">
          <div className="teams" id="team1">
            <div className="players">
              {team1.length ? (
                team1.map((player, index) => (
                  <p key={index} className="box">
                    {player.Name}
                  </p>
                ))
              ) : (
                <div style={{ height: "80px" }} />
              )}
            </div>
          </div>
          <div className="teams" id="team2">
            <div className="players">
              {team2.length ? (
                team2.map((player, index) => (
                  <p key={index} className="box">
                    {player.Name}
                  </p>
                ))
              ) : (
                <div style={{ height: "80px" }} />
              )}
            </div>
          </div>
        </div>
      </div>
      {team1.length && team2.length && !MatchStarted ? (
        <div className="flex-center-xy">
          <button
            className="mt1 btn btn-primary font-large"
            onMouseEnter={() => Audio.menuMove()}
            onClick={() => {
              Audio.menuSelect();
              AcceptTeams();
            }}
          >
            Begin Match
          </button>
          <button
            className="mt1 btn btn-link font-large"
            onMouseEnter={() => Audio.menuMove()}
            onClick={() => {
              Audio.menuSelect();
              randomizeTeams();
            }}
          >
            New Teams
          </button>
        </div>
      ) : null}

      <img
        width="100"
        src={thefuckingplantImage}
        id="theFuckingPlant"
        alt="the fucking plant"
      />

      {!team1.length && !team2.length ? (
        <Modal text="Randomizing Teams..." />
      ) : null}
    </div>
  );
}

export default TeamRandomizer;
