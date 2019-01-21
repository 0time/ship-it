const {expect} = require('chai');
const {radiansFromDegrees} = require('../../src/math/trig');

describe('trig.js', () => {
  describe('radiansFromDegrees()', () => {
    const fixtures = [
      {description: '0 == 0 radians', input: 0, expected: 0},
      {
        description: '30 == pi/6 radians',
        input: 30,
        expected: Math.PI / 6,
      },
      {
        description: '45 == pi/4 radians',
        input: 45,
        expected: Math.PI / 4,
      },
      {
        description: '60 == pi/3 radians',
        input: 60,
        expected: Math.PI / 3,
      },
      {
        description: '120 == 2 * pi/3 radians',
        input: 120,
        expected: (Math.PI * 2) / 3,
      },
      {
        description: '-210 == -7 * pi/6 radians',
        input: -210,
        expected: Math.PI * (-7 / 6),
      },
      {
        description: '-240 == -4 * pi/3 radians',
        input: -240,
        expected: Math.PI * (-4 / 3),
      },
    ];

    fixtures.forEach(({description, expected, input}) =>
      it(description, () =>
        expect(radiansFromDegrees(input)).to.equal(expected),
      ),
    );
  });
});
