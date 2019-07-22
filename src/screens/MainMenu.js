import React, { useEffect } from "react";
import "../App.scss";
import { Link } from "react-navi";

function MainMenu() {
  useEffect(() => {
    //
  }, []);

  return (
    <div className="MainMenu screen">
      <h1 className="mt2 main-title">Ping Pong!</h1>
      <h1>Start new game:</h1>
      <div className="main-menu-contents">
        <Link href="/2v2" direction="forward">
          <button className="main-menu-btn">2 vs 2</button>
        </Link>
      </div>
    </div>
  );
}

export default MainMenu;
