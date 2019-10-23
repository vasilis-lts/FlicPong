import React, { useEffect, useState } from "react";
import thefuckingplantImage from "../assets/images/the_fucking_plant.png";
import "../App.scss";
import Modal from "../components/Modal";
import { Link } from "react-navi";
import Audio from "../audio/AudioController";
import Api from "../ApiMethods";
import appSettings from "../appSettings";
import { Transition } from "react-spring/renderprops";
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
    if (PlayersSelected.length > 0) {
      randomizeTeams(PlayersSelected);
    }
    // eslint-disable-next-line
  }, [PlayersSelected]);

  const getPlayers = async () => {
    const players = await Api.get(appSettings.endpoints.GetPlayers);
    console.log(players);
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
    // const postBody = prep2v2MatchBody();

    // let _MatchData = await Api.post(
    //   appSettings.endpoints.Save2v2Match,
    //   postBody
    // );

    // if (typeof _MatchData === "object") {
    // setMatchData(_MatchData);
    // localStorage.setItem("MatchInProgress", JSON.stringify(_MatchData));
    // } else {
    //   console.log(_MatchData);
    // }
  };

  const prep2v2MatchBody = () => {
    return {
      Player1Team1Id: team1[0].Id,
      Player2Team1Id: team1[1].Id,
      Player1Team2Id: team2[0].Id,
      Player2Team2Id: team2[1].Id
    };
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
        <Transition
          items={MatchInProgress}
          config={{ duration: 200 }}
          from={{ position: "absolute", opacity: 0, transform: "scale(0.6)" }}
          enter={{ opacity: 1, transform: "scale(1)" }}
          leave={{ opacity: 0, transform: "scale(0.6)" }}
        >
          {MatchInProgress =>
            MatchInProgress
              ? props => (
                  <div style={props}>
                    <button
                      className="btn btn-primary font-large"
                      onMouseEnter={() => Audio.menuMove()}
                      onClick={() => {
                        Audio.menuSelect();
                        randomizeTeams();
                      }}
                    >
                      New Match
                    </button>
                  </div>
                )
              : props => (
                  <div style={props}>
                    <button
                      className="btn btn-primary font-large"
                      onMouseEnter={() => Audio.menuMove()}
                      disabled={team1.length === 0}
                      onClick={() => {
                        Audio.menuSelect();
                        AcceptTeams();
                      }}
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
                      New Teams
                    </button>
                  </div>
                )
          }
        </Transition>
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
