import { run } from 'formula';
import parser from './parser';
import Excel from '../models/excel';

const processExcel = (model, inputs) => {
  const results = {};
  try {
    model.formulae.forEach(f => {
      const { sheet, ref, name, output } = f.cell;
      const expressionInputs = {};
      let expr = f.expression;
      const ranges = parser.getRangeTokens(expr);

      ranges.forEach((range, key) => {
        const replaced = model
          .explodeRange(sheet, range)
          .map(cell => (cell.input ? inputs[cell.name] : cell.value));
        const rangeVar = `r${key}`;
        expr = expr.replace(range, rangeVar);
        expressionInputs[rangeVar] =
          replaced.length > 1 ? replaced : replaced[0];
      });
      // Update the data model with the new computed value for the formula cell
      model.setCellValueByRef(sheet, ref, run(expr, expressionInputs));

      console.log(
        'COMPUTED',
        `${sheet}!${ref}`,
        `=${expr}`,
        expressionInputs,
        `=> ${model.getCellValueByRef(sheet, ref)}`
      );

      if (output) {
        results[name] = model.getCellValueByRef(sheet, ref);
      }
    });
  } catch (e) {
    console.log('Error processing spreadsheet:', e.message);
  }
  return results;
};

export default (model = new Excel()) => inputs => processExcel(model, inputs);
