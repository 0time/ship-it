const {logOnce} = require('../util/logging');
const {degreesFromRadians} = require('../math/trig');

const capSpeed = maxSpeed => entity => {
  const speed = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);

  if (speed > maxSpeed) logOnce('capSpeed:7')(`Exceed max speed!`);

  return {
    vx: speed > maxSpeed ? (entity.vx * maxSpeed) / speed : entity.vx,
    vy: speed > maxSpeed ? (entity.vy * maxSpeed) / speed : entity.vy,
  };
};

const capAngularSpeed = maxAngularSpeed => entity =>
  Math.abs(entity.va) > maxAngularSpeed
    ? (Math.abs(entity.va) / entity.va) * maxAngularSpeed
    : entity.va;

module.exports = {
  capAngularSpeed,
  capSpeed,
};
