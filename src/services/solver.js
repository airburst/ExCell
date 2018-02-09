import { run } from 'formula';
import parser from './parser';
import Excel from '../models/excel';

const processExcel = (model, inputs) => {
  const results = {};
  model.formulae.forEach(f => {
    const { sheet, ref, name, output } = f.cell;
    const expressionInputs = {};
    const ranges = parser.getRangeTokens(f.expression);
    ranges.forEach(range => {
      const replaced = model
        .explodeRange(sheet, range)
        .map(cell => (cell.input ? inputs[cell.name] : cell.value));
      expressionInputs[range] = replaced.length > 1 ? replaced : replaced[0];
    });
    console.log(f.expression, expressionInputs);
    model.setCellValueByRef(sheet, ref, run(f.expression, expressionInputs));
    if (output) {
      results[name] = model.getCellValueByRef(sheet, ref);
    }
  });
  return results;
};

export default (model = new Excel()) => inputs => processExcel(model, inputs);
