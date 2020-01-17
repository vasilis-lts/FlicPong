import React, { useState, useEffect } from "react";
import appSettings from "../appSettings";

export default function CoinFlip(props) {
  const [CoinState, setCoinState] = useState("");
  const [ResultMessage, setResultMessage] = useState(
    "Choose Red or Black then click the Coin!"
  );
  const [CoinFlipped, setCoinFlipped] = useState(false);
  const [SocketMessage, setSocketMessage] = useState({});

  const url = "ws://localhost:8080/";
  const connection = new WebSocket(url);

  useEffect(() => {
    console.log(SocketMessage);
    switch (SocketMessage.buttonAction) {
      case appSettings.ButtonActions.SinglePress:
        flipCoin();
        break;
      case appSettings.ButtonActions.Hold:
        break;
      case appSettings.ButtonActions.DoublePress:
        // nothing yet
        break;

      default:
        break;
    }
    // eslint-disable-next-line
  }, [SocketMessage]);

  useEffect(() => {
    console.log(connection);

    connection.onopen = () => {
      console.log("connection opened");
    };

    connection.onerror = error => {
      console.log(`WebSocket error: ${JSON.stringify(error)}`);
    };

    connection.onmessage = e => {
      setSocketMessage(JSON.parse(e.data));
    };

    // eslint-disable-next-line
  }, []);

  function hideModal() {
    setTimeout(() => {
      props.autohide();
    }, 4000);
  }

  const flipCoin = () => {
    if (!CoinFlipped) {
      var flipResult = Math.random();
      setCoinState("");
      setResultMessage("");
      setCoinFlipped(true);

      setTimeout(function() {
        if (flipResult <= 0.5) {
          setCoinState("heads");
          setTimeout(() => {
            setResultMessage("Red Wins!");
            hideModal();
          }, 3000);
        } else {
          setCoinState("tails");

          setTimeout(() => {
            setResultMessage("Black Wins!");
            hideModal();
          }, 3000);
        }
      }, 100);
    }
  };

  return (
    <div className="coin-container">
      <div id="coin" className={CoinState} onClick={() => flipCoin()}>
        <div className="side-a"></div>
        <div className="side-b"></div>
      </div>
      <h6 className="mt3" id="coinResult">
        {ResultMessage}
      </h6>
    </div>
  );
}
