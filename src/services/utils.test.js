/* eslint-env jest */
import { dp } from './utils';

describe('Utils Service', () => {
  describe('rounds to specified decimal places', () => {
    test('rounding up', () => {
      expect(dp(123.456789)).toBe(123.46);
      expect(dp(123.456789, 0)).toBe(123);
      expect(dp(123.456789, 3)).toBe(123.457);
      expect(dp(123.452)).toBe(123.45);
    });
  });
});