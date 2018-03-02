# ExCell

## A tool to convert Excel spreadsheets into real-time JavaScript calculations
This app allows users to upload an Excel spreadsheet with a `.xlsx` file extension and then generates a JavaScript module with a runnable version of its calculations.

A test harness is also created, allowing you to check that calculations are correct before downloading and implementing in your own projects.

This app relies upon the excellent [formula](https://github.com/FormBucket/formula) library of Excel functions, written in native JavaScript.  You must either include this library as a dependency (the default in generated code), with `npm install --save formula`, or add an inline script tag in your HTML to import a distribution version of `formula.min.js`.

## Preparing Excel Spreadsheets
The app needs a way to identify which cells are inputs and outputs of the overall calculation. To do this, simply add cell comments using the style:

```
I: My input tag name
```

```
O: My output tag name
```

Any tag name text between the colon and a line break, or end of text, will be camel-cased into a variable name.  So e.g. the named input variable above will become `myInputTagName`.

## Generated Code
Example generated run script:

```
import { run } from 'formula';

const calculate = inputData => {
  const d = {"A":180,"B":3,"C":60};
  const formulae = [
    {"ref":"A","expression":"(r0-2)*180","d":1,"inputs":{"r0":"numberofsides"},"output":"internalangle"},
    {"ref":"C","expression":"r0/r1","d":2,"inputs":{"r0":"A","r1":"numberofsides"},"output":"regularangle"}
  ];
  const results = {};

  const getValue = ref => {
    if (inputData[ref] !== undefined) { return inputData[ref]; }
    if (d[ref] !== undefined) { return d[ref]; }
    return ref;
  };

  const getValues = refs => {
    if (!Array.isArray(refs)) { return getValue(refs); }
    return refs.map(
      ref => (!Array.isArray(ref) ? getValue(ref) : getValues(ref))
    );
  };

  const processInputs = inputs => {
    const processed = {};
    Object.entries(inputs).forEach(([key, value]) => {
      processed[key] = getValues(value);
    });
    return processed;
  };

  try {
    formulae.forEach(f => {
      const { ref, expression, inputs, output } = f;
      d[ref] = run(expression, processInputs(inputs));
      if (output) { results[output] = d[ref]; }
    });
  } catch (e) {
    console.log('Error processing spreadsheet:', e.message);
  }

  return results;
};

export default calculate;
```

## Example use in a Project
Inputs and outputs are JavaScript objects, comprising all of the named tags as keys. Additional keys in the inputs collection will be ignored.

In a library like React, use form state for inputs and outputs **with names that match the tag variables from your spreadsheet**.

Add an event handler for `onChange` or `onClick` to pass the inputs object into the calculate function.
```
import calculate from './Calculate';

...

doCalculation = inputs => {
  const results = calculate(inputs);
  // Optionally convert the output object into an array
  const outputs = Object.entries(results).map(([name, value]) => ({ [name]: value }));
  this.setState({ outputs });
};
```

And in inline JS:
```
<script src="path-to-formula.min.js"></script>
<script src="Calculate.js"></script>
<script>
  // Collect input values from form DOM or request
  const inputs = { age: 40, weight: 83.2, height: 1.85 };
  const outputs = calculate(inputs);
  // Do stuff with outputs object
</script>
```