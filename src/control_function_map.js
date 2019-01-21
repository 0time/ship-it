const {calculateThrust} = require('./physics/thrust');

const thrustHelper = thrustRotation => context => {
  const thrust = calculateThrust(context.player.rotation)(thrustRotation);

  context.player.vx += thrust.x * context.constants.thrust;
  context.player.vy += thrust.y * context.constants.thrust;
};

const angThrustHelper = direction => context => {
  context.player.va +=
    context.constants.angularThrustMultiplier *
    direction *
    context.constants.thrust;
};

const angThrustStop = context => {
  const thrust =
    context.constants.angularThrustMultiplier * context.constants.thrust;

  const before = context.player.va;

  if (context.player.va > 0) {
    context.player.va -= thrust;
  } else if (context.player.va < 0) {
    context.player.va += thrust;
  } else {
    // already stopped
  }
};

const controlFunctionMap = {
  forwardThrust: thrustHelper(Math.PI),
  reverseThrust: thrustHelper(0),
  starboardThrust: thrustHelper(Math.PI / 2.0),
  portThrust: thrustHelper(Math.PI / -2.0),
  cwThrust: angThrustHelper(1),
  ccwThrust: angThrustHelper(-1),
  stopAngularMomentum: angThrustStop,
};

module.exports = controlFunctionMap;
