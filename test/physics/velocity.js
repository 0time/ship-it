const Promise = require('bluebird');

const {marginOfError} = require('../config');
const {capAngularSpeed, capSpeed} = require('../../src/physics/velocity');

const {expect} = require('chai');

describe('velocity.js', () => {
  describe('capSpeed()', () => {
    const testPromise = (vx, vy, maxSpeed) =>
      Promise.resolve().then(() =>
        Promise.props({
          actual: capSpeed(maxSpeed)({vx, vy}),
          maxSpeed,
          vx,
          vy,
        }),
      );

    const pythagoreanMaxSpeedMessage = (vx, vy, c, maxSpeed) =>
      `sqrt(${vx}^2 + ${vy}^2) results in a max speed of ${c} which is greater than ${maxSpeed}`;

    const expectPythagoreanMaxSpeed = ({actual: {vx, vy}, maxSpeed}) => {
      const c = Math.sqrt(vx * vx + vy * vy);

      return expect(
        c,
        pythagoreanMaxSpeedMessage(vx, vy, c, maxSpeed),
      ).to.be.at.most(maxSpeed);
    };

    const signConsistencyMessage = (actual, whichVelocity) =>
      `${whichVelocity} is ${
        actual[whichVelocity] < 0 ? 'positive' : 'negative'
      } while actual.${whichVelocity} is not`;

    const expectSignConsistency = ({actual, vx, vy}) => {
      expect(vx > 0, signConsistencyMessage(actual, 'vx')).to.equal(
        actual.vx > 0,
      );
      expect(vy > 0, signConsistencyMessage(actual, 'vy')).to.equal(
        actual.vy > 0,
      );
    };

    const expectTargetVectorConsistency = ({actual, vx, vy}) =>
      expect(Math.atan(vy / vx)).to.closeTo(
        Math.atan(actual.vy / actual.vx),
        marginOfError,
      );

    const expectUnchanged = ({actual, vx, vy}) =>
      Promise.all([
        expect(actual.vx).to.equal(vx),
        expect(actual.vy).to.equal(vy),
      ]);

    it('3,4,5 triangle limited to 2.5', () =>
      testPromise(3, 4, 2.5)
        .tap(expectPythagoreanMaxSpeed)
        .tap(expectSignConsistency)
        .tap(expectTargetVectorConsistency));

    it('3,4,5 triangle limited to 10', () =>
      testPromise(3, 4, 10)
        .tap(expectPythagoreanMaxSpeed)
        .tap(expectSignConsistency)
        .tap(expectTargetVectorConsistency)
        .tap(expectUnchanged));

    it('-3,4,5 limited to 2.5', () =>
      testPromise(-3, 4, 2.5)
        .tap(expectPythagoreanMaxSpeed)
        .tap(expectSignConsistency)
        .tap(expectTargetVectorConsistency));

    it('-3,-4,5 limited to 2.5', () =>
      testPromise(-3, -4, 2.5)
        .tap(expectPythagoreanMaxSpeed)
        .tap(expectSignConsistency)
        .tap(expectTargetVectorConsistency));

    it('3,-4,5 limited to 2.5', () =>
      testPromise(-3, -4, 2.5)
        .tap(expectPythagoreanMaxSpeed)
        .tap(expectSignConsistency)
        .tap(expectTargetVectorConsistency));
  });
});
