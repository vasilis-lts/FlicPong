import React, { useEffect } from "react";
import "../App.scss";

function MainMenu() {
  useEffect(() => {
    //
  }, []);

  return (
    <div className="MainMenu screen">
      <h1 className="main-title">Ping Pong!</h1>
      <h1>Start new game:</h1>
      <div className="main-menu-contents">
        <button className="main-menu-btn">2 vs 2</button>
      </div>
    </div>
  );
}

export default MainMenu;
