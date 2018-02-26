import { run } from 'formula';
import parser from './parser';
import Excel from './Excel';

const expandRange = (model, sheet, range, inputs) =>
  model.explodeRange(sheet, range).map(row => {
    if (!row.length) {
      return row.input ? inputs[row.name] : row.value;
    }
    return row.map(cell => (cell.input ? inputs[cell.name] : cell.value));
  });

const processExcel = (model, inputs) => {
  const results = {};
  try {
    model.formulae.forEach(f => {
      const { sheet, ref, name, output } = f.cell;
      const expressionInputs = {};
      let expr = f.expression;
      const ranges = parser.getRangeTokens(expr);

      ranges.forEach((range, key) => {
        const replaced = expandRange(model, sheet, range, inputs);
        const rangeVar = `r${key}`;
        expr = expr.replace(range, rangeVar);
        expressionInputs[rangeVar] =
          replaced.length > 1 ? replaced : replaced[0];
      });
      model.setCellValue(sheet, ref, run(expr, expressionInputs));
      // console.log(
      //   'COMPUTED',
      //   `${sheet}!${ref}`,
      //   `=${expr}`,
      //   expressionInputs,
      //   `=> ${model.getCellValue(sheet, ref)}`
      // );
      if (output) {
        results[name] = model.getCellValue(sheet, ref);
      }
    });
  } catch (e) {
    model.addError('Solver', e.message);
    console.log('Error processing spreadsheet:', e.message);
  }
  return results;
};

export default (model = new Excel()) => inputs => processExcel(model, inputs);
