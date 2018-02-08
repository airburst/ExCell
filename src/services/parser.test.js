/* eslint-env jest */
import parser from './parser';

describe('Parser Service', () => {
  test('finds all tokens in a formula', () => {
    const tokens = parser.getTokens('=(weight/(height*height))');
    expect(tokens.length).toBe(9);
  });

  test('finds all range tokens in a formula', () => {
    const r = parser.getRangeTokens('=(weight/(height*height))');
    expect(r.length).toBe(3);
    expect(r).toMatchObject(['weight', 'height', 'height']);
  });
});