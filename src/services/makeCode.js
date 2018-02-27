export default model => {
  const { d, formulae } = model;

  const code = `
  import { run } from 'formula';

  const calculate = inputData => {
    const d = ${JSON.stringify(d)};
    const formulae = ${JSON.stringify(formulae)};
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

  export default calculate;
  `;

  return code;
};
