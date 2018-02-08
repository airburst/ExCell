# ExCell

## Tool to convert Excel spreadsheets into JavaScript solver functions

Example generated run script:

```
// Static data from workbook
// May include named ranges for convenience, TBD
const d = {
  'sheet1!A2': 5,
};

// inputs is a POJO
const calculate = (inputs) => {
  d['sheet2!A3'] = run('=200-age', { ...inputs, ...d }); // temp assignment
  const heartRate = run('=200-age', { ...inputs, ...d }); // output assignment
  const bmi = run('=weight/(height*height)', { ...inputs, ...d });

  return {
    heartRate,
    bmi,
  };
}
```

Example use:

```
<script src="path-to-formula"></script>
<script src="calculate.js"></script>
<script>
  // Collect input values from form or request
  const inputs = { age: 48, weight: 83.2, height: 1.85 };
  const outputs = calculate(inputs);
  // Do stuff with outputs
</script>
```