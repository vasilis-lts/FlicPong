var Matter = window.Matter;

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

Matter.use("matter-collision-events");

var GAME_WIDTH = window.innerWidth;
var GAME_HEIGHT = window.innerHeight;
var TABLE_POS_Y = GAME_HEIGHT - 50;
var TABLE_HEIGHT = 20;

var ballSettings = {
  inertia: 0,
  friction: 0,
  frictionStatic: 0,
  frictionAir: 0,
  restitution: 0.9,
  render: {
    fillStyle: "#ffffff"
  }
};

var engine = Engine.create();
let ball = Bodies.circle(-10, GAME_HEIGHT - 80, 20, ballSettings);

function pingPongAnimation() {
  this.run = function() {
    // create an engine
    // create a renderer
    var render = Render.create({
      element: document.getElementById("pingPongAnimationCanvas"),
      engine: engine,
      options: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        wireframes: false,
        background: "#212121"
      }
    });

    var bottomWall = Bodies.rectangle(
      GAME_WIDTH / 2,
      TABLE_POS_Y,
      GAME_WIDTH,
      TABLE_HEIGHT,
      {
        isStatic: true,
        render: {
          fillStyle: "#00ff00"
        }
      }
    );

    var Net = Bodies.rectangle(GAME_WIDTH / 2, TABLE_POS_Y - 40, 5, 60, {
      isStatic: true,
      render: {
        fillStyle: "#00ff00"
      }
    });

    ball.onCollide(function(pair) {
      console.log("BoxB got hit!", pair);
      // pair.bodyA.render.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      // pair.bodyB.render.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    });

    // add all of the bodies to the world
    World.add(engine.world, [bottomWall, Net, ball]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    this.animationLoop();
  };
  this.animationLoop = () => {
    // let leftPlayerHits = true;

    this.leftPlayerHit();
    // leftPlayerHits = !leftPlayerHits;

    // setInterval(() => {
    //   leftPlayerHits ? this.leftPlayerHit2() : this.rightPlayerHit();
    //   leftPlayerHits = !leftPlayerHits;
    // }, 1000);
  };
  this.leftPlayerHit = () => {
    console.log("hit");

    Body.applyForce(
      ball,
      { x: ball.position.x, y: ball.position.y },
      { x: 0.05, y: -0.015 }
    );
  };
  this.rightPlayerHit = () => {
    console.log("hit2");

    Body.applyForce(
      ball,
      { x: ball.position.x, y: ball.position.y },
      { x: -0.22, y: -0.015 }
    );
  };

  // Matter.Composite.remove(world, body)
  // end
}
export default pingPongAnimation;
