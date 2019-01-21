const radiansFromDegrees = degrees => (degrees / 180) * Math.PI;
const degreesFromRadians = radians => ((radians * 180) / Math.PI) % 360;

module.exports = {
  degreesFromRadians,
  radiansFromDegrees,
};
