/* eslint-env jest */
import { run } from 'formula';
import { dp } from './utils';

const inputs = {
  age: 48,
  weight: 83.4,
  height: 1.85,
};
const sumArray = [[1, 2, 3], [4, 5, 6]];

/** *
 * NOTE: The formula library contains a full set of
 * unit tests. This test set is a minimal amount
 * to prove confidence in the way that the app
 * will make use of formula as a solver.
 */
describe('Formula module', () => {
  test('correctly calculates using specified inputs', () => {
    expect(run('=(220-age)', inputs)).toBe(172);
    expect(dp(run('=(weight/(height*height))', inputs))).toBe('24.37');
  });

  test('cannot calculate using inferred inputs', () => {
    const a = 50;
    expect(run('=(220-a)')).toMatchObject(
      new Error({ name: 'Invalid value', message: '#VALUE!' })
    );
  });

  test('correctly calculates using array inputs', () => {
    expect(run('=SUM(sumArray)', { sumArray })).toBe(21);
  });
});
