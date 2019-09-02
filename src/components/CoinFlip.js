import React, { useEffect } from "react";

export default function CoinFlip(props) {
  useEffect(() => {
    autohide();
    // eslint-disable-next-line
  }, []);

  function autohide() {
    setTimeout(() => {
      props.autohide();
    }, 10000);
  }

  const flipIt = () => {
    var flipResult = Math.random();
    // $('#coin').removeClass();
    const coinElem = document.getElementById("coin");
    coinElem.className = "";

    setTimeout(function() {
      if (flipResult <= 0.5) {
        // $('#coin').addClass('heads');
        coinElem.classList.add("heads");
        console.log("it is head");
      } else {
        coinElem.classList.add("tails");

        console.log("it is tails");
      }
    }, 100);
  };

  return (
    <div className="p2">
      <div id="coin" onClick={() => flipIt()}>
        <div class="side-a"></div>
        <div class="side-b"></div>
      </div>
      <h1>Click on coin to flip</h1>
    </div>
  );
}
