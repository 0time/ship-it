const controlMapKeys = {
  forwardThrust: {
    defaultControl: {
      caseSensitive: false,
      key: 'w',
      type: 'held',
    },
  },
  reverseThrust: {
    defaultControl: {
      caseSensitive: false,
      key: 's',
      type: 'held',
    },
  },
  starboardThrust: {
    defaultControl: {
      caseSensitive: false,
      key: 'a',
      type: 'held',
    },
  },
  portThrust: {
    defaultControl: {
      caseSensitive: false,
      key: 'd',
      type: 'held',
    },
  },
  cwThrust: {
    defaultControl: {
      key: 'ArrowRight',
      type: 'held',
    },
  },
  ccwThrust: {
    defaultControl: {
      key: 'ArrowLeft',
      type: 'held',
    },
  },
  stopAngularMomentum: {
    defaultControl: {
      key: 'ArrowDown',
      type: 'held',
    },
  },
};

module.exports = controlMapKeys;
