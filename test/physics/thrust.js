const {expect} = require('chai');
const {radiansFromDegrees} = require('../../src/math/trig');
const {calculateThrust} = require('../../src/physics/thrust');

const MARGIN_OF_ERROR = 0.00000001;

describe('thrust.js', () => {
  describe('calculateThrust(entityRot, thrustRot)', () => {
    const fixtures = [
      {description: '(N, U) == N', input: [0, 0], expected: {x: 0, y: 1}},
      {
        description: '(N, D) == S',
        input: [0, Math.PI],
        expected: {x: 0, y: -1},
      },
      {
        description: '(E, U) == E',
        input: [Math.PI / 2.0, 0],
        expected: {x: 1, y: 0},
      },
      {
        description: '(W, U) == W',
        input: [(3.0 / 2.0) * Math.PI, 0],
        expected: {x: -1, y: 0},
      },
      {
        description: '(W, L) == S',
        input: [(3.0 / 2.0) * Math.PI, (3.0 / 2.0) * Math.PI],
        expected: {x: 0, y: -1},
      },
      {
        description: '(120, D) == ?',
        input: [(4.0 / 3.0) * Math.PI, Math.PI],
        expected: {
          x: Math.sin((7.0 / 3.0) * Math.PI),
          y: Math.cos((7.0 / 3.0) * Math.PI),
        },
      },
      {
        description: '(150, D) == ?',
        input: [(11.0 / 6.0) * Math.PI, Math.PI],
        expected: {
          x: Math.sin((17.0 / 6.0) * Math.PI),
          y: Math.cos((17.0 / 6.0) * Math.PI),
        },
      },
    ];

    const testFn = (input, expected) => {
      const actual = calculateThrust(input[0])(input[1]);

      expect(actual.x).to.be.closeTo(expected.x, MARGIN_OF_ERROR);
      expect(actual.y).to.be.closeTo(expected.y, MARGIN_OF_ERROR);
    };

    fixtures.forEach(({description, expected, input}) =>
      it(description, () => testFn(input, expected)),
    );
  });
});
