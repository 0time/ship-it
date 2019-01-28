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

// Performs a log only after minInterval time has passed since the last log
// event
const logAtInterval = ({key, minimal, minInterval}) => contents => {
  const last = logTracker[key] || 0;
  const now = Date.now();

  if (now - last > minInterval) {
    logTracker[key] = now;

    if (minimal) {
      console.error(contents);
    } else {
      console.error({
        contents,
        key,
        minInterval,
      });
    }
  }
};

module.exports = {
  logAtInterval,
  logNTimes,
  logOnce,
};
