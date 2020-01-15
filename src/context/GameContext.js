import React, { useState } from "react";

const GameContext = React.createContext();

const GameProvider = props => {
  const [state, setState] = useState({
    playerHovered: 0,
    activePlayers: []
  });
  return (
    <GameContext.Provider value={[state, setState]}>
      {props.children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
