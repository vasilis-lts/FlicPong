import React, { useState, useEffect } from "react";
import { Link } from "react-navi";

export default function PlayerSelection(props) {
  const style = {
    playersSelected: {
      margin: "0",
      fontSize: "3vw",
      width: 100 / props.playersAmount + "%"
    }
  };

  const [SelectedBoxes, setSelectedBoxes] = useState([]);
  const [SelectedPlayers, setSelectedPlayers] = useState([]);
  const [CountryActive, setCountryActive] = useState("GR");
  const [ActivePlayersByCountry, setActivePlayersByCountry] = useState([]);

  useEffect(() => {
    const playersActive = props.players.filter(player => {
      return player.Country === CountryActive;
    });
    setActivePlayersByCountry(playersActive);
    // eslint-disable-next-line
  }, [CountryActive]);

  const isPlayerSelected = id => {
    const _selectedPlayers = [...SelectedPlayers];
    let playerSelected = false;
    let i;

    if (_selectedPlayers.length) {
      // check if player is selected
      _selectedPlayers.forEach((player, index) => {
        if (props.players[id - 1].Name === player.Name) {
          playerSelected = true;
          i = index;
        }
      });
    }

    return [playerSelected, i];
  };

  function selectBoxClicked(e, playerId) {
    // id equals index in players list

    const _selectedPlayers = [...SelectedPlayers];
    const _selectedBoxes = [...SelectedBoxes];
    const clickedBox = playerId;

    const [playerSelected, index] = isPlayerSelected(clickedBox);

    if (playerSelected) {
      _selectedPlayers.splice(index, 1);
      _selectedBoxes.splice(_selectedBoxes.indexOf(clickedBox), 1);
    } else {
      if (SelectedPlayers.length < props.playersAmount) {
        _selectedPlayers.push(props.players[clickedBox - 1]);
        _selectedBoxes.push(clickedBox);
      }
    }

    setSelectedBoxes(_selectedBoxes);
    setSelectedPlayers(_selectedPlayers);
  }

  return (
    <div>
      <div className="flex sb">
        <div className="flex">
          <h1>Players select!</h1>
          <h3
            className={`country-selection ${
              CountryActive === "GR" ? "highlighted-country" : ""
            }`}
            onClick={() => setCountryActive("GR")}
          >
            GR
          </h3>
          <h3
            className={`country-selection ${
              CountryActive === "NL" ? "highlighted-country" : ""
            }`}
            onClick={() => setCountryActive("NL")}
          >
            NL
          </h3>
        </div>
        <h3>
          {SelectedPlayers.length <= props.playersAmount - 1 ? (
            <Link href="/main-menu" direction="forward">
              <h3 className="m0">Back to main menu</h3>
            </Link>
          ) : (
            // `Select ${4 - SelectedPlayers.length} ${
            //   SelectedPlayers.length !== 0 ? "more" : ""
            // } player${SelectedPlayers.length < 3 ? "s" : ""} `
            <button
              className="btn btn-primary"
              onClick={() => props.onPlayersSelected(SelectedPlayers)}
            >
              <h3 className="m0">Confirm Players?</h3>
            </button>
          )}
        </h3>
      </div>
      <div className="flex">
        {ActivePlayersByCountry.map((player, index) => (
          <div
            className={`player-select-box ${
              SelectedBoxes.includes(player.Id) ? "selected" : ""
            }`}
            key={player.Id}
            id={index}
            onClick={e => selectBoxClicked(e, player.Id)}
          >
            {player.Name}
          </div>
        ))}
      </div>
      <div className="flex mt2">
        <h4 style={style.playersSelected}>
          P1 {SelectedPlayers[0] ? SelectedPlayers[0].Name : "..."}
        </h4>
        <h4 style={style.playersSelected}>
          P2 {SelectedPlayers[1] ? SelectedPlayers[1].Name : "..."}
        </h4>
        <h4 style={style.playersSelected}>
          P3 {SelectedPlayers[2] ? SelectedPlayers[2].Name : "..."}
        </h4>
        <h4 style={style.playersSelected}>
          P4 {SelectedPlayers[3] ? SelectedPlayers[3].Name : "..."}
        </h4>
      </div>
    </div>
  );
}
