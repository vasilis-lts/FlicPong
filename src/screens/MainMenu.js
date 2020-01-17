import React, { useState, useEffect } from "react";
import "../App.scss";
import { Link, useNavigation } from "react-navi";

import Modal from "../components/Modal";
import CoinFlip from "../components/CoinFlip";
import ballBounceAnimRun from "./ballBounceAnimation";
import appSettings from "../appSettings";

let animInterval;

function MainMenu() {
  const url = "ws://localhost:8080/";
  const connection = new WebSocket(url);

  const [showCoinFlip, setShowCoinFlip] = useState(false);
  let navigation = useNavigation();

  const singlePress = () => {
    console.log(showCoinFlip);
    if (!showCoinFlip) {
      navigation.navigate("/2v2");
    }
  };

  // useEffect(() => {
  //   console.log(socketHook);
  // }, [socketHook]);

  useEffect(() => {
    animInterval = setInterval(() => {
      ballBounceAnimRun();
    }, 20000);

    console.log(connection);

    connection.onopen = () => {
      console.log("connection opened");
    };

    connection.onerror = error => {
      console.log(`WebSocket error: ${JSON.stringify(error)}`);
    };

    connection.onmessage = e => {
      flicMessageHandler(JSON.parse(e.data));
    };

    return () => {
      connection.close();
      clearInterval(animInterval);
    };

    // eslint-disable-next-line
  }, []);

  const flicMessageHandler = SocketMessage => {
    switch (SocketMessage.buttonAction) {
      case appSettings.ButtonActions.SinglePress:
        singlePress();
        break;
      case appSettings.ButtonActions.Hold:
        setShowCoinFlip(true);
        break;
      case appSettings.ButtonActions.DoublePress:
        // nothing yet
        break;

      default:
        break;
    }
  };

  return (
    <div className="main-menu-outer">
      <div className="MainMenu screen">
        <div id="mainMenuCoin" onClick={() => setShowCoinFlip(true)} />

        <h2 className={`main-title`}>Ping Pong!</h2>

        <h1 className="white mt2">Choose game mode:</h1>
        <div className="main-menu-contents">
          <Link href="/2v2" direction="forward">
            <button className="main-menu-btn">2 vs 2</button>
          </Link>
        </div>

        {showCoinFlip && (
          <Modal>
            <CoinFlip autohide={() => setShowCoinFlip(false)} />
          </Modal>
        )}
      </div>
      <div id="ball"></div>
    </div>
  );
}

export default MainMenu;
