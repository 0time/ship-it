const {degreesFromRadians} = require('../math/trig');

const calculateThrust = entityRotation => thrustAngle => {
  const angle = entityRotation + thrustAngle;

  return {
    x: Math.sin(-angle),
    y: Math.cos(-angle),
  };
};

module.exports = {
  calculateThrust,
};
