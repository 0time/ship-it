const $ = require('jquery');

const PIXI = require('pixi.js');
const packageJson = require('./package.json');

const gameDiv = $('#game');

const app = new PIXI.Application();

gameDiv.append(app.view);

const {
  repository: {url},
  version,
} = packageJson;

const repoLinkDiv = $('<div />', {
  id: 'repository-link',
  text: 'Source: ',
}).appendTo('#game-info');

$('<a />', {text: url})
  .attr('href', url)
  .appendTo(repoLinkDiv);

$('<div />', {text: `Version: v${version}`}).appendTo('#game-info');

// create a new Sprite from an image path
const hubble = PIXI.Sprite.fromImage('assets/final/hubble.png');

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
