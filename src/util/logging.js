const logTracker = {};

const logNTimes = ({key, max}) => contents => {
  if (!(logTracker[key] >= max)) {
    console.error({
      contents,
      key,
    });

    logTracker[key] = logTracker[key] === undefined ? 1 : logTracker[key] + 1;
  }
};

const logOnce = key => logNTimes({key, max: 1});

module.exports = {
  logNTimes,
  logOnce,
};
