import React, { useEffect, useState } from "react";
import thefuckingplantImage from "../assets/images/xmastree.png";
import "../App.scss";
import Modal from "../components/Modal";
import { Link } from "react-navi";
import Api from "../ApiMethods";
import appSettings from "../appSettings";
import { saveGameWon2v2 } from "../controllers/2v2Controller";
import CoinFlip from "../components/CoinFlip";
import PlayerSelection from "../components/PlayerSelection";

function TeamRandomizer() {
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [MatchInProgress, setMatchInProgress] = useState(false);
  // eslint-disable-next-line
  const [MatchData, setMatchData] = useState({});
  const [Players, setPlayers] = useState([]);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [ShowResultModal, setShowResultModal] = useState(false);
  const [WinningTeam, setWinningTeam] = useState("");
  const [showPlayerSelection, setshowPlayerSelection] = useState(false);
  const [PlayersSelected, setPlayersSelected] = useState([]);

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    const url = "ws://localhost:8080/";
    const connection = new WebSocket(url);

    connection.onopen = () => {
      console.log("connection opened");
    };

    connection.onerror = error => {
      console.log(`WebSocket error: ${JSON.stringify(error)}`);
    };

    connection.onmessage = e => {
      console.log(e.data);
    };

    // setTimeout(() => {
    //   flic();
    // }, 5000);

    return () => {
      connection.onclose = () => {
        console.log("disconnected");
        // automatically try to reconnect on connection loss
      };
      connection.close();
    };
  }, []);

  const flic = async () => {
    console.log("flic posting");
    let flicPost = await Api.post(appSettings.endpoints.FlicClick);
    console.log(flicPost);
  };

  useEffect(() => {
    if (PlayersSelected.length > 0) {
      randomizeTeams(PlayersSelected);
    }
    // eslint-disable-next-line
  }, [PlayersSelected]);

  const getPlayers = async () => {
    const players = await Api.get(appSettings.endpoints.GetPlayers);
    setPlayers([...players]);
    setshowPlayerSelection(true);
  };

  const randomizeTeams = () => {
    const players = [...PlayersSelected];

    if (PlayersSelected.length) {
      localStorage.removeItem("MatchInProgress");

      const numberOfPlayers = players.length;
      let team1 = [];
      let team2 = [];

      setTeam1([]);
      setTeam2([]);
      setMatchInProgress(false);

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
      }, 2000);
    }
  };

  const AcceptTeams = async () => {
    setMatchInProgress(true);
  };

  const game2v2Win = (teamName, winningTeam) => {
    console.log("test" + teamName);
    if (MatchInProgress) {
      setMatchInProgress(false);
      setShowResultModal(true);
      setWinningTeam(teamName);
      saveGameWon2v2(winningTeam, Players);

      setTimeout(() => {
        setShowResultModal(false);
      }, 5000);
    }
  };

  const onPlayersSelected = playersSelected => {
    const _playersSelected = [...playersSelected];
    setPlayersSelected(_playersSelected);

    setshowPlayerSelection(false);
  };

  return (
    <div className="TeamRandomizer screen">
      <div className="flex space-b">
        <Link href="/main" className="nav-link main-menu-link mt1">
          {`<- Back to main menu`}
        </Link>
        <h3 className="mt1 btn-link" onClick={() => setShowCoinFlip(true)}>
          Coin
        </h3>
      </div>
      <div className="flex">
        <div
          className="team-title red"
          onClick={() => game2v2Win("Red Team", team1)}
        >
          <h1>Red Team</h1>
        </div>
        <div
          className="team-title green"
          onClick={() => game2v2Win("Plant Team", team2)}
        >
          <h1>Plant Team</h1>
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
      <div className="flex-center-xy mt3">
        {MatchInProgress ? (
          <div>
            <button
              className="btn btn-primary font-large"
              onClick={() => randomizeTeams()}
            >
              New Match
            </button>
          </div>
        ) : (
          <div>
            <button
              className="btn btn-primary font-large"
              disabled={team1.length === 0}
              onClick={() => AcceptTeams()}
            >
              Begin Match
            </button>
            <button
              className="btn btn-link font-large"
              onMouseEnter={() => Audio.menuMove()}
              disabled={team1.length === 0}
              onClick={() => {
                Audio.menuSelect();
                randomizeTeams();
              }}
            >
              Randomize positions!
            </button>
          </div>
        )}
      </div>
      <img
        width="150"
        src={thefuckingplantImage}
        id="theFuckingPlant"
        alt="the fucking plant"
      />
      {!team1.length && !team2.length ? (
        <Modal>
          <h1>Shuffling Positions</h1>
        </Modal>
      ) : null}
      {ShowResultModal && (
        <Modal>
          <h1>{WinningTeam} Wins!</h1>
        </Modal>
      )}
      {showCoinFlip && (
        <Modal>
          <CoinFlip autohide={() => setShowCoinFlip(false)} />
        </Modal>
      )}
      {showPlayerSelection && (
        <Modal>
          <PlayerSelection
            players={Players}
            playersAmount={4}
            onPlayersSelected={onPlayersSelected}
          />
        </Modal>
      )}
    </div>
  );
}

export default TeamRandomizer;
