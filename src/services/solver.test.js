/* eslint-env jest */
import { run } from 'formula';

const inputData = {
  numberOfSides: 4,
};

const d = {
  'Sheet1!B2': 3,
  'Sheet1!D2': 180,
  'Sheet1!E2': 60,
};

const formulae = [
  {
    ref: 'Sheet1!D2',
    expression: '(r0-2)*180',
    d: 1,
    inputs: { r0: 'numberOfSides' },
  },
  {
    ref: 'Sheet1!E2',
    expression: 'r0/r1',
    d: 2,
    inputs: { r0: 'Sheet1!D2', r1: 'numberOfSides' },
  },
];

const results = {};

const getValue = ref => {
  console.log(`getValue: ${ref}`);
  if (inputData[ref]) {
    return inputData[ref];
  }
  if (d[ref]) {
    return d[ref];
  }
  return ref;
};

const getValues = refs => {
  if (!Array.isArray(refs)) {
    return getValue(refs);
  }
  return refs.map(
    ref => (!Array.isArray(ref) ? getValue(ref) : getValues(ref))
  );
};

const processInputs = inputs => {
  const values = {};
  Object.entries(inputs).forEach((value, key) => {
    values[key] = getValues(value);
  });
  return values;
};

describe('Solver module', () => {
  test('correctly assigns values to input objects', () => {
    expect(getValue('numberOfSides')).toBe(4);
    expect(getValue('Sheet1!D2')).toBe(180);
    expect(getValue(3000)).toBe(3000);
    expect(getValue(0)).toBe(0);
    expect(getValue('missing')).toBe('missing');
  });
});
