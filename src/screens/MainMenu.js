import React, { useState, useEffect } from "react";
import "../App.scss";
import { Link } from "react-navi";
import Audio from "../audio/AudioController";

import Modal from "../components/Modal";
import CoinFlip from "../components/CoinFlip";
import ballBounceAnimRun from "./ballBounceAnimation";

let animInterval;

function MainMenu() {
  const [showCoinFlip, setShowCoinFlip] = useState(false);

  useEffect(() => {
    animInterval = setInterval(() => {
      ballBounceAnimRun();
    }, 20000);

    return () => {
      clearInterval(animInterval);
    };

    // eslint-disable-next-line
  }, []);

  return (
    <div className="main-menu-outer">
      <div className="MainMenu screen">
        <div id="mainMenuCoin" onClick={() => setShowCoinFlip(true)} />

        <h2 className={`main-title`}>Ping Pong!</h2>

        <h1 className="white mt2">Choose game mode:</h1>
        <div className="main-menu-contents">
          <Link href="/2v2" direction="forward">
            <button
              onClick={() => Audio.menuSelect()}
              onMouseEnter={() => Audio.menuMove()}
              className="main-menu-btn"
            >
              2 vs 2
            </button>
          </Link>
        </div>

        {showCoinFlip && (
          <Modal>
            <CoinFlip autohide={() => setShowCoinFlip(false)} />
          </Modal>
        )}
      </div>
      <div id="ball"></div>
      <div id="pingPongAnimationCanvas" />
    </div>
  );
}

export default MainMenu;
