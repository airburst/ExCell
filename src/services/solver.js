import { run } from 'formula';
import Excel from './Excel';

const processExcel = (model, inputData) => {
  const { d, formulae } = model;
  const results = {};

  const getValue = ref => {
    if (inputData[ref] !== undefined) {
      return inputData[ref];
    }
    if (d[ref] !== undefined) {
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
    Object.entries(inputs).forEach(([key, value]) => {
      values[key] = getValues(value);
    });
    return values;
  };

  try {
    formulae.forEach(f => {
      const { ref, expression, inputs, output } = f;
      d[ref] = run(expression, processInputs(inputs));
      if (output) {
        results[output] = d[ref];
      }
    });
  } catch (e) {
    console.log('Error processing spreadsheet:', e.message);
  }
  return results;
};

export default (model = new Excel()) => inputs => processExcel(model, inputs);
