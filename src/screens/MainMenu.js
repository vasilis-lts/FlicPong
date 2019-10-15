import React, { useState } from "react";
import "../App.scss";
import { Link } from "react-navi";
import Audio from "../audio/AudioController";

import { useSpring, animated } from "react-spring";
import Modal from "../components/Modal";
import CoinFlip from "../components/CoinFlip";

function MainMenu() {
  const [showCoinFlip, setShowCoinFlip] = useState(false);

  const { x } = useSpring({
    from: { x: 0 },
    x: 1,
    config: { duration: 1200 }
  });

  return (
    <div className="MainMenu screen">
      <div id="mainMenuCoin" onClick={() => setShowCoinFlip(true)} />

      <animated.div
        style={{
          opacity: x.interpolate({ range: [0, 1], output: [0.3, 1] }),
          transform: x
            .interpolate({
              range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
              output: [1, 0.97, 0.9, 1.03, 0.9, 1.03, 1]
            })
            .interpolate(x => `scale(${x})`)
        }}
      >
        <h1 className="mt1 main-title">Ping Pong!</h1>
      </animated.div>
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
  );
}

export default MainMenu;
