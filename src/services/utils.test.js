/* eslint-env jest */
import { dp, parseNumber } from './utils';

describe('Utils Service', () => {
  describe('rounds to specified decimal places', () => {
    test('rounding up', () => {
      expect(dp(123.456789)).toBe('123.46');
      expect(dp(123.456789, 0)).toBe('123');
      expect(dp(123.456789, 3)).toBe('123.457');
      expect(dp(123.452)).toBe('123.45');
      expect(dp(123.4)).toBe('123.40');
    });
  });

  describe('Parses numbers into correct formats', () => {
    describe('Handles currency', () => {
      test('formats Excel currency (UK)', () => {
        expect(
          parseNumber(
            123,
            '_-[$£-809]* #,##0.00_-;\\-[$£-809]* #,##0.00_-;_-[$£-809]* "-"??_-;_-@_-'
          )
        ).toBe('£123.00');
        expect(
          parseNumber(
            123.4567,
            '_-[$£-809]* #,##0.00_-;\\-[$£-809]* #,##0.00_-;_-[$£-809]* "-"??_-;_-@_-'
          )
        ).toBe('£123.46');
      });

      test('formats user-defined currency', () => {
        expect(parseNumber(1234, '"£"#,##0')).toBe('£1,234');
      });
    });

    test('formats number without format info', () => {
      expect(parseNumber('123.1')).toBe('123.1');
    });

    test('formats General number', () => {
      expect(parseNumber('123.1', 'General')).toBe('123.1');
    });

    test('formats Thousands number', () => {
      expect(parseNumber(8.9, '#,##0')).toBe('9');
      expect(parseNumber(45678.9, '#,##0')).toBe('45,679');
    });

    test('formats general number to decimal places', () => {
      expect(parseNumber(13, '0.000')).toBe('13.000');
      expect(parseNumber('13.45', '0.0')).toBe('13.5');
    });
  });
});
