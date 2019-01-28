const {sanityCheckCreator} = require('./util/sanity_check_creator');
const {capAngularSpeed, capSpeed} = require('./physics/velocity');

const badValues = [NaN, undefined, false];

const sanityChecker = itm => badValues.filter(badValue => badValue === itm);
const sanityCheck = sanityCheckCreator(sanityChecker);

const printError = msg => `Moveable Error ${msg}`;

const moveableCreator = context => entity => delta => {
  if (sanityCheck(delta) === false) return printError(`delta=${delta}`);
  if (sanityCheck(entity.x, entity.y) === false)
    return printError(`entity[x,y]=${entity.x},${entity.y}`);
  if (sanityCheck(entity.vx, entity.vy) === false)
    return printError(`entity[vx,vy]=${entity.vx},${entity.vy}`);

  entity.va = capAngularSpeed(context.constants.maxAngularVelocity)(entity);

  const speedCheckedV = capSpeed(context.constants.maxVelocity)(entity);

  entity.vx = speedCheckedV.vx;
  entity.vy = speedCheckedV.vy;

  entity.x += delta * entity.vx;
  entity.y += delta * entity.vy;
  entity.rotation += delta * entity.va;
};

module.exports = moveableCreator;
