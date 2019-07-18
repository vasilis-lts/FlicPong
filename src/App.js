import React, { useEffect, useState } from "react";
import "./App.scss";
import Screen2v2 from "./screens/2v2Screen";
// import MainMenu from "./screens/MainMenu";

function App() {
  const [MainmenuVisible, setMainmenuVisible] = useState(true);
  const [Screen2v2Visible, setScreen2v2Visible] = useState(false);

  useEffect(() => {
    //
  }, []);

  const goTo2v2 = () => {
    setScreen2v2Visible(true);
    setMainmenuVisible(false);
  };

  const goToMainMenu = () => {
    setScreen2v2Visible(false);
    setMainmenuVisible(true);
  };

  return (
    <div className="App">
      {MainmenuVisible && (
        <div className="MainMenu">
          <h1 className="main-title">Ping Pong!</h1>
          <h1>Start new game</h1>
          <div className="main-menu-contents">
            <button className="main-menu-btn" onClick={e => goTo2v2(e)}>
              2 vs 2
            </button>
          </div>
        </div>
      )}
      {Screen2v2Visible && <Screen2v2 goToMainMenu={e => goToMainMenu()} />}
    </div>
  );
}

export default App;
