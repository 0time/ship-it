// TODO: Merge user defined controls into the controlMapKeys and use
// user defined controls when present, reverting to defaults when absent
const controlMapKeys = require('./control_map_keys');
const controlFunctionMap = require('./control_function_map');
const {keyboard} = require('./inputs/keyboard');

const configuredKeys = [];

const configureControls = context =>
  Object.keys(controlMapKeys).forEach(controlMapKey => {
    const {
      defaultControl: {caseSensitive, key, type},
    } = controlMapKeys[controlMapKey];

    const controlFunction = controlFunctionMap[controlMapKey];

    const keys = [];

    if (caseSensitive === false) {
      keys.push(key.toLowerCase());
      keys.push(key.toUpperCase());
    } else {
      keys.push(key);
    }

    keys.forEach(keyToMap => {
      const keyControl = keyboard(context, key);

      keyControl[type] = () => controlFunction(context);

      configuredKeys.push(keyControl);
    });
  });

const unsubscribeAll = () => configuredKeys.forEach(key => key.unsubscribe());

module.exports = {
  configureControls,
  unsubscribeAll,
};
