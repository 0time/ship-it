const PIXI = require('pixi.js');

const app = new PIXI.Application();

document.getElementById('game').appendChild(app.view);

// create a new Sprite from an image path
var hubble = PIXI.Sprite.fromImage('assets/final/hubble.png');

// center the sprite's anchor point
hubble.anchor.set(0.5);

// move the sprite to the center of the screen
hubble.x = app.screen.width / 2;
hubble.y = app.screen.height / 2;

hubble.vx = 0;
hubble.vy = 0;
hubble.va = 0; // Angular velocity

app.stage.addChild(hubble);

const context = {
  constants: {
    angularThrustMultiplier: 0.001,
    thrust: 0.01,
  },
  entities: [hubble],
  player: hubble,
  register: fn => app.ticker.add(fn),
  unregister: fn => app.ticker.remove(fn),
};

const {configureControls} = require('./src/controls');

configureControls(context);

console.log(hubble);

app.ticker.add(delta => {
  context.entities.forEach(entity => {
    entity.x += delta * entity.vx;
    entity.y += delta * entity.vy;
    entity.rotation += delta * entity.va;
  });
});

/*
// Listen for animate update
app.ticker.add(function(delta) {
  // just for fun, let's rotate mr rabbit a little
  // delta is 1 if running at 100% performance
  // creates frame-independent transformation
  hubble.rotation += 0.01 * delta;
});
*/
