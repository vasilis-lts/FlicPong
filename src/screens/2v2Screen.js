import React, { useEffect, useState } from "react";
import thefuckingplantImage from "../assets/images/the_fucking_plant.png";
import "../App.scss";
import Modal from "../components/Modal";
import { Link, useNavigation } from "react-navi";
import Api from "../ApiMethods";
import appSettings from "../appSettings";
// import { saveGameWon2v2 } from "../controllers/2v2Controller";
import CoinFlip from "../components/CoinFlip";
import PlayerSelection from "../components/PlayerSelection";
import useLocalStorage from "../hooks/useLocalStorage";

function TeamRandomizer() {
  const MaxSets = 3;

  const { clearScore, increaseSetsWon } = useLocalStorage();

  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [MatchInProgress, setMatchInProgress] = useState(false);
  // eslint-disable-next-line
  // const [MatchData, setMatchData] = useState({});
  const [Players, setPlayers] = useState([]);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [
    ShowResultModal
    //  setShowResultModal
  ] = useState(false);
  const [
    WinningTeam
    //  setWinningTeam
  ] = useState("");
  const [showPlayerSelection, setshowPlayerSelection] = useState(false);
  const [PlayersSelected, setPlayersSelected] = useState([]);
  const [
    PlayerHovered
    //  setPlayerHovered
  ] = useState(0);
  const [SetsWonTeam1, setSetsWonTeam1] = useState(0);
  const [SetsWonTeam2, setSetsWonTeam2] = useState(0);
  const [SetNumber, setSetNumber] = useState(1);
  const [TeamLeftScore, setTeamLeftScore] = useState(0);
  const [TeamRightScore, setTeamRightScore] = useState(0);
  const [AfterSetModal, setAfterSetModal] = useState(false);
  const [AfterSetModalText, setAfterSetModalText] = useState(
    "Next set! Switch sides!"
  );
  const [canIncrementScore, setcanIncrementScore] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    getPlayers();
  }, []);

  const initSocketConnection = () => {
    const url = "ws://localhost:8080/";
    const connection = new WebSocket(url);

    connection.onopen = () => {
      // console.log("connection opened");
      console.log("MatchInProgress:" + MatchInProgress);
    };

    connection.onerror = error => {
      console.log(`WebSocket error: ${JSON.stringify(error)}`);
    };

    connection.onmessage = e => {
      flicMessageHandler(JSON.parse(e.data));
    };

    initGame();

    return () => {
      connection.close();
      console.log("Disconnecting...");
      connection.onclose = () => {
        console.log("disconnected");
        // automatically try to reconnect on connection loss
      };
      localStorage.removeItem("MatchInProgress");
      localStorage.setItem("ScoreTeam1", "0");
      localStorage.setItem("ScoreTeam2", "0");
    };
  };

  useEffect(() => {
    if (PlayersSelected.length > 0) {
      randomizeTeams(PlayersSelected);
    }
    // eslint-disable-next-line
  }, [PlayersSelected]);

  const initGame = () => {
    let scoreTeam1, scoreTeam2;
    // if (localStorage.getItem("MatchInProgress") === "true") {
    // scoreTeam1 = localStorage.getItem("ScoreTeam1");
    // scoreTeam2 = localStorage.getItem("ScoreTeam2");

    localStorage.setItem("SetsWonTeam1", 0);
    localStorage.setItem("SetsWonTeam2", 0);
    // } else {
    scoreTeam1 = 0;
    scoreTeam2 = 0;
    localStorage.setItem("ScoreTeam1", scoreTeam1);
    localStorage.setItem("ScoreTeam2", scoreTeam2);
    localStorage.setItem("SetsWonTeam1", 0);
    localStorage.setItem("SetsWonTeam2", 0);
    localStorage.setItem("SetsTeamLeft", 0);
    localStorage.setItem("SetsTeamRight", 0);
    localStorage.setItem("SetsWonTeam2", 0);
    localStorage.setItem("SetNumber", 1);
    localStorage.setItem("Team1Position", "Left");
    localStorage.setItem("CanIncrementScore", true);

    localStorage.setItem("WinningScore", 21);

    setSetsWonTeam1(0);
    setSetsWonTeam2(0);
    setTeamLeftScore(0);
    setTeamRightScore(0);
    // }

    // init SetNumber
    if (localStorage.getItem("SetNumber")) {
      const setNumber = localStorage.getItem("SetNumber");
      setSetNumber(parseInt(setNumber, 10));
    } else {
      localStorage.setItem("SetNumber", "1");
      setSetNumber(1);
    }
  };

  const flicMessageHandler = SocketMessage => {
    switch (SocketMessage.buttonAction) {
      case appSettings.ButtonActions.SinglePress:
        singlePress(SocketMessage);
        break;
      case appSettings.ButtonActions.Hold:
        buttonHold(SocketMessage);
        // setShowCoinFlip(true);
        break;
      case appSettings.ButtonActions.DoublePress:
        // nothing yet
        break;

      default:
        break;
    }
  };

  const singlePress = buttonMessage => {
    if (localStorage.getItem("MatchInProgress") === "true") {
      const setNumber = localStorage.getItem("SetNumber");
      //
      if (buttonMessage.buttonId.indexOf("TeamLeft") > -1) {
        setNumber % 2 === 0 ? incrementScore("Team2") : incrementScore("Team1");
      } else if (buttonMessage.buttonId.indexOf("TeamRight") > -1) {
        setNumber % 2 === 0 ? incrementScore("Team1") : incrementScore("Team2");
      }
    } else {
      const beginMatchBtn = document.getElementById("beginMatchBtn");
      beginMatchBtn.click();
    }
  };

  const buttonHold = buttonMessage => {
    if (localStorage.getItem("MatchInProgress") === "true") {
      initGame();
    } else {
      navigation.navigate("/main-menu");
    }
  };

  const incrementScore = team => {
    if (localStorage.getItem("CanIncrementScore") === "true") {
      if (canIncrementScore) {
        let score = localStorage.getItem("Score" + team);
        score++;
        localStorage.setItem("Score" + team, score);

        team === "Team1" ? setTeamLeftScore(score) : setTeamRightScore(score);

        const scoreTeam1 = parseInt(localStorage.getItem("ScoreTeam1"), 10);
        const scoreTeam2 = parseInt(localStorage.getItem("ScoreTeam2"), 10);

        let winningScore = parseInt(localStorage.getItem("WinningScore"));

        if (
          scoreTeam1 === winningScore - 1 &&
          scoreTeam2 === winningScore - 1
        ) {
          winningScore++;
          localStorage.setItem("WinningScore", winningScore);
        }

        if (score >= winningScore) {
          const setsWon = increaseSetsWon(team);
          team === "Team1"
            ? setSetsWonTeam1(setsWon)
            : setSetsWonTeam2(setsWon);

          const setsWonTeam1 = parseInt(
            localStorage.getItem("SetsWonTeam1"),
            10
          );
          const setsWonTeam2 = parseInt(
            localStorage.getItem("SetsWonTeam2"),
            10
          );

          localStorage.setItem("CanIncrementScore", false);
          if (setsWonTeam1 === MaxSets - 1 || setsWonTeam2 === MaxSets - 1) {
            finishMatch(team);
          } else {
            setAfterSetModal(true);
            setcanIncrementScore(false);

            setTimeout(() => {
              changeSet();
            }, 10000);
          }
        }
      }
    }
  };

  const finishMatch = teamWon => {
    setAfterSetModal(true);

    let modalText;

    const winningPlayers = [...JSON.parse(localStorage.getItem(teamWon))];

    modalText = `${winningPlayers[0].Name} and ${winningPlayers[1].Name} win!`;

    setAfterSetModalText(`${modalText}`);
    setTimeout(() => {
      setAfterSetModal(false);
      navigation.navigate("/main-menu");
    }, 10000);
  };

  const changeSet = () => {
    resetScore();

    let setNumber = localStorage.getItem("SetNumber");

    const setsWonTeam1 = localStorage.getItem("SetsWonTeam1");
    const setsWonTeam2 = localStorage.getItem("SetsWonTeam2");

    if (setsWonTeam1 < MaxSets - 1 && setsWonTeam2 < MaxSets - 1) {
      setNumber++;
      setSetNumber(setNumber);
      localStorage.setItem("SetNumber", setNumber);
    }
    setcanIncrementScore(true);
    setAfterSetModal(false);
    localStorage.setItem("CanIncrementScore", true);
  };

  const resetScore = () => {
    clearScore();
    setTeamLeftScore(0);
    setTeamRightScore(0);
    localStorage.setItem("WinningScore", 21);
  };

  const getPlayers = async () => {
    const players = await Api.get(appSettings.endpoints.GetPlayers);
    setPlayers([...players]);
    setshowPlayerSelection(true);
  };

  const randomizeTeams = () => {
    const players = [...PlayersSelected];

    if (PlayersSelected.length) {
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

        localStorage.setItem("Team1", JSON.stringify(team1));
        localStorage.setItem("Team2", JSON.stringify(team2));
      }, 2000);
    }
  };

  // const BeginMatch = () => {
  //   setMatchInProgress(true);
  //   localStorage.setItem("MatchInProgress", true);
  // };

  // const game2v2Win = (teamName, winningTeam) => {
  //   console.log("test" + teamName);
  //   if (MatchInProgress) {
  //     setMatchInProgress(false);
  //     setShowResultModal(true);
  //     setWinningTeam(teamName);
  //     saveGameWon2v2(winningTeam, Players);

  //     setTimeout(() => {
  //       setShowResultModal(false);
  //     }, 5000);
  //   }
  // };

  const onPlayersSelected = playersSelected => {
    const _playersSelected = [...playersSelected];
    setPlayersSelected(_playersSelected);

    setshowPlayerSelection(false);
  };

  return (
    <div className="TeamRandomizer screen TableScreen">
      <div className="flex space-b hidden">
        <Link href="/main" className="nav-link main-menu-link mt1">
          <p id="backBtn">{`<- Back to main menu`}</p>
        </Link>
        {/* <h3 className="mt1 btn-link" onClick={() => setShowCoinFlip(true)}>
          Coin
        </h3> */}
      </div>
      <div className="flex-center-x">
        <h3 className="score-title">SET {SetNumber}</h3>
      </div>
      <div className="flex-center-x">
        <div className="flex">
          <div className="flex">
            <h1 className="set-numbers">
              ({SetNumber % 2 === 1 ? SetsWonTeam1 : SetsWonTeam2})
            </h1>
            <h1 className="score-numbers">
              {SetNumber % 2 === 1 ? TeamLeftScore : TeamRightScore}
              {` : `}
              {SetNumber % 2 === 1 ? TeamRightScore : TeamLeftScore}
            </h1>
            <h1 className="set-numbers">
              ({SetNumber % 2 === 1 ? SetsWonTeam2 : SetsWonTeam1})
            </h1>
          </div>
        </div>
      </div>
      <div className="teams-container">
        <div className="flex">
          {SetNumber % 2 === 1 ? (
            <div className="teams border-right-white" id="team1">
              <div className="players">
                {team1.length ? (
                  team1.map((player, index) => (
                    <p key={index} className={`box`}>
                      {player.Name}
                    </p>
                  ))
                ) : (
                  <div style={{ height: "80px" }} />
                )}
              </div>
            </div>
          ) : (
            <div className="teams border-right-white" id="team2">
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
          )}
          {SetNumber % 2 === 0 ? (
            <div className="teams " id="team1">
              <div className="players">
                {team1.length ? (
                  team1.map((player, index) => (
                    <p key={index} className={`box`}>
                      {player.Name}
                    </p>
                  ))
                ) : (
                  <div style={{ height: "80px" }} />
                )}
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
      {/* <div className="flex-center-xy mt1">
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
              id="beginMatchBtn"
              className="btn btn-primary font-large"
              disabled={team1.length === 0}
              onClick={() => BeginMatch()}
            >
              Begin Match
            </button>
            <button
              className="btn btn-link font-large"
              disabled={team1.length === 0}
              onClick={() => {
                randomizeTeams();
              }}
            >
              Randomize positions!
            </button>
          </div>
        )}
      </div> */}
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
            PlayerHovered={PlayerHovered}
            init2v2SocketConnection={initSocketConnection}
          />
        </Modal>
      )}
      {AfterSetModal && (
        <Modal>
          <div>{AfterSetModalText}</div>
        </Modal>
      )}
    </div>
  );
}

export default TeamRandomizer;
