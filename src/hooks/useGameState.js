import { useContext } from "react";
import { GameContext } from "../context/GameContext";

const useGameState = () => {
  const [state, setState] = useContext(GameContext);

  function incrementPlayerHovered() {
    let _playerHovered = state.playerHovered;
    _playerHovered += 1;
    console.log(_playerHovered);
    setState(state => ({
      ...state,
      playerHovered: _playerHovered
    }));
  }

  function setActivePlayers(activePlayers) {
    const _activePlayers = [...activePlayers];
    console.log(_activePlayers);
    setState(state => ({
      ...state,
      activePlayers: _activePlayers
    }));
  }

  function getActivePlayers() {
    console.log(state);
  }

  return {
    playerHovered: state.playerHovered,
    incrementPlayerHovered,
    activePlayers: state.activePlayers,
    setActivePlayers,
    getActivePlayers
  };
};

export default useGameState;
