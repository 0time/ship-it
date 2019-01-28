const PIXI = require('pixi.js');
const Promise = require('bluebird');
const getGuiConfig = require('./get_gui_config');

const configured = context => configuredGuiElementName =>
  Promise.resolve(getGuiConfig(context)(configuredGuiElementName))
    .tap(console.error)
    .then(config => ({
      config,
      style: new PIXI.TextStyle(
        Object.assign({}, context.gui.fontSettings, config.fontSettings),
      ),
    }))
    .then(({config, style}) => ({
      config,
      style,
      richText: new PIXI.Text(config.text, style),
    }))
    .tap(({config, richText}) => {
      richText.x = config.x;
      richText.y = config.y;
    })
    .tap(({richText}) => context.app.stage.addChild(richText))
    .then(({config, richText}) => {
      context.gui[config.name] = richText;
    });

module.exports = configured;
