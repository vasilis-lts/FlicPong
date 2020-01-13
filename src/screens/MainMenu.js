import React, { useState, useEffect } from "react";
import "../App.scss";
import { Link, useNavigation } from "react-navi";

import Modal from "../components/Modal";
import CoinFlip from "../components/CoinFlip";
import ballBounceAnimRun from "./ballBounceAnimation";

let animInterval;

function MainMenu() {
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  let navigation = useNavigation();

  useEffect(() => {
    animInterval = setInterval(() => {
      ballBounceAnimRun();
    }, 20000);

    const url = "ws://localhost:8080/";
    const connection = new WebSocket(url);

    console.log(connection);

    connection.onopen = () => {
      console.log("connection opened");
    };

    connection.onerror = error => {
      console.log(`WebSocket error: ${JSON.stringify(error)}`);
    };

    connection.onmessage = e => {
      navigation.navigate("/2v2");
      console.log(e.data);
    };

    return () => {
      connection.close();
      console.log("Disconnecting...");
      connection.onclose = () => {
        console.log("disconnected");
        // automatically try to reconnect on connection loss
      };
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
