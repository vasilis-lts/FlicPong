const YUI = window.YUI;

const WINDOW_HEIGHT = window.innerHeight;
const WINDOW_WIDTH = window.innerWidth;
const ballDiameter = 50;

let startingSpot = {
  x: -ballDiameter,
  y: WINDOW_HEIGHT / 1.25 - ballDiameter
};
let endingSpot = {
  x: WINDOW_WIDTH / 1.5 - ballDiameter,
  y: WINDOW_HEIGHT - ballDiameter
};

let midSpot = { x: WINDOW_WIDTH / 1.75, y: WINDOW_HEIGHT / 1.25 };

let endingSpot2 = {};
endingSpot2.x = WINDOW_WIDTH + ballDiameter;
endingSpot2.y = WINDOW_HEIGHT / 1.25 - ballDiameter;

let midSpot2 = {};
midSpot2.x = WINDOW_WIDTH / 1.25;
midSpot2.y = WINDOW_HEIGHT / 1.25;

function ballBounceAnimRun() {
  YUI().use("anim", function(Y) {
    var ball = Y.one("#ball");

    var anim = new Y.Anim({
      node: ball,
      duration: 0.5,
      easing: Y.Easing.easeNone
    });

    var anim2 = new Y.Anim({
      node: ball,
      duration: 0.2,
      easing: Y.Easing.easeOut
    });

    var setToAnimStart = function() {
      if (ball) {
        ball.setStyles({ left: startingSpot.x, top: startingSpot.y }); // Where x0, y0 is the animation starting point
      }
    };

    // var setToAnimStart2 = function() {
    //   node.setStyles({ left: endingSpot.x, top: endingSpot.y }); // Where x0, y0 is the animation starting point
    // };

    var startAnim = function(e) {
      anim.set("to", {
        curve: [
          [midSpot.x, midSpot.y],
          [endingSpot.x, endingSpot.y]
        ] // Where 1 and 2 are curve control points, and 3 is the end point.
      });
      if (ball) {
        anim.run();
      }
    };

    var startAnim2 = function(e) {
      anim2.set("to", {
        curve: [
          [midSpot2.x, midSpot2.y],
          [endingSpot2.x, endingSpot2.y]
        ] // Where 1 and 2 are curve control points, and 3 is the end point.
      });
      if (ball) {
        anim2.run();
      }
    };

    var onEnd = function() {
      startAnim2();
    };
    setToAnimStart();
    startAnim();
    anim.on("end", onEnd);
  });
}
export default ballBounceAnimRun;
