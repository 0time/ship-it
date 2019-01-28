const $ = require('jquery');

const PIXI = require('pixi.js');

const configured = require('./src/gui/configured');
const {logOnce} = require('./src/util/logging');
const {getSpeed} = require('./src/physics/velocity');
const {toSpeedUnits} = require('./src/gui/units');
const config = require('./config');
const packageJson = require('./package.json');
const moveableCreator = require('./src/moveable_creator');

const gameDiv = $('#game');

const app = new PIXI.Application();

gameDiv.append(app.view);

const {
  repository: {url},
  pretty,
  version,
} = packageJson;

$('.pretty-title').text(pretty);

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

const context = Object.assign(
  {
    app,
    entities: [hubble],
    player: hubble,
    register: fn => app.ticker.add(fn),
    unregister: fn => app.ticker.remove(fn),
  },
  config,
);

const makeAMoveable = moveableCreator(context);

context.entities.forEach(entity => {
  entity.active = true;
  entity.ticks = [makeAMoveable(entity)];
});

const {configureControls} = require('./src/controls');

const logged = {};

configureControls(context);

context.gui.list.forEach(guiItem => configured(context)(guiItem.name));

app.ticker.add(delta => {
  context.entities.forEach(entity =>
    entity.active ? entity.ticks.forEach(tick => tick(delta)) : null,
  );

  if (context.gui.speed !== undefined) {
    context.gui.speed.text = `Speed: ${toSpeedUnits(getSpeed(context.player))}`;
  }
});
