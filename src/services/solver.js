// import { run } from 'formula';
// import parser from './parser';
import Excel from '../models/excel';

// const testInputs = {
//   tenneeds: '[1, 3, 5]',
//   impairmentyesno: 0,
//   wellbeing: 3,
//   badMatch: 'nothing',
// };

export default class Solver {
  constructor(excel = new Excel()) {
    this.d = {};
    this.processExcel(excel);
  }

  processExcel(model) {
    // For each formula in the model, get the set of input range cell
    // values and rewrite the formula with those static values
    // Add every static value into the data object
    // If the formula cell is an output, assign the result to a named var
    model.formulae.forEach(f => {
      model.precedents(f.cell).forEach(cell => {
        this.d[`${cell.sheet}!${cell.ref}`] = cell.value;
      });
    });
  }

  getInputRefByName(name) {
    return this.inputs().filter(i => i.name === name)[0];
  }
}
