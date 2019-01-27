const {expect} = require('chai');
const {radiansFromDegrees} = require('../../src/math/trig');
const {calculateThrust} = require('../../src/physics/thrust');

const MARGIN_OF_ERROR = 0.00000001;

describe('thrust.js', () => {
  describe('calculateThrust(entityRot, thrustRot)', () => {
    const fixtures = [
      {
        description: '(Facing North, `W` key) == North',
        input: [0, 0],
        expected: {x: 0, y: 1},
      },
      {
        description: '(Facing North, `S` key) == South',
        input: [0, Math.PI],
        expected: {x: 0, y: -1},
      },
      {
        description: '(Facing East, `W` key) == East',
        input: [-Math.PI / 2.0, 0],
        expected: {x: 1, y: 0},
      },
      {
        description: '(Facing West, `W` key) == West',
        input: [(3.0 / 2.0) * Math.PI, 0],
        expected: {x: 1, y: 0},
      },
      {
        description: '(Facing West, `A` key) == South',
        input: [(3.0 / 2.0) * Math.PI, (3.0 / 2.0) * Math.PI],
        expected: {x: 0, y: -1},
      },
      {
        description:
          '(Facing 120 clockwise from North, `S` key) == 60 counter-clockwise from North',
        input: [(4.0 / 3.0) * Math.PI, Math.PI],
        expected: {
          x: Math.sin(-(7.0 / 3.0) * Math.PI),
          y: Math.cos(-(7.0 / 3.0) * Math.PI),
        },
      },
      {
        description: '(150, D) == ?',
        input: [(11.0 / 6.0) * Math.PI, Math.PI],
        expected: {
          x: Math.sin(-(17.0 / 6.0) * Math.PI),
          y: Math.cos(-(17.0 / 6.0) * Math.PI),
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
