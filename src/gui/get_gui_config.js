const getGuiConfig = context => needle =>
  context.gui.list.find(({name}) => name === needle);

module.exports = getGuiConfig;
