import React, { useState } from "react";

export default function CoinFlip(props) {
  const [CoinState, setCoinState] = useState("");
  const [ResultMessage, setResultMessage] = useState(
    "Choose Red or Black then click the Coin!"
  );
  const [CoinFlipped, setCoinFlipped] = useState(false);

  function hideModal() {
    setTimeout(() => {
      props.autohide();
    }, 4000);
  }

  const flipIt = () => {
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
      <div id="coin" className={CoinState} onClick={() => flipIt()}>
        <div className="side-a"></div>
        <div className="side-b"></div>
      </div>
      <h6 className="mt3" id="coinResult">
        {ResultMessage}
      </h6>
    </div>
  );
}
