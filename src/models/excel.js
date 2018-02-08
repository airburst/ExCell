import XLSX from 'xlsx';
import parser from '../services/parser';
import { flatten } from '../services/utils';
import Cell from './cell';

const splitOutSheetName = (sheet, range) => {
  const r = range.split('!');
  if (r.length === 2) {
    return { sheet: r[0], range: r[1] };
  }
  return { sheet, range };
};

export default class Excel {
  constructor(file) {
    this.data = [];
    this.inputs = [];
    this.outputs = [];
    this.formulae = [];
    this.errors = [];
    this.loadFile(file);
  }

  loadFile(file) {
    if (file) {
      try {
        this.load(file);
        this.getInputs();
        this.getOutputs();
        this.calculateDepths();
        this.getFormulaeByDepth();
      } catch (e) {
        console.log('Error loading Excel file:', e.message);
      }
    }
  }

  getInputs() {
    this.inputs = this.data.filter(c => c.input);
  }

  getOutputs() {
    this.outputs = this.data.filter(c => c.output);
  }

  getFormulaeByDepth() {
    this.formulae = this.cellsWithDepth()
      .sort((a, b) => {
        if (a.depth > b.depth) {
          return 1;
        }
        return b.depth > a.depth ? -1 : 0;
      })
      .map(cell => ({ cell, expression: cell.formula }));
  }

  cellsWithDepth() {
    return this.data.filter(c => c.depth > 0);
  }

  addError(type = '', message = '', cell = undefined) {
    this.errors.push({ type, message, cell });
    console.error(`${type}: ${message}.  Cell ref: ${cell}`);
  }

  // Load data with non-empty cells
  load(file) {
    const workbook = XLSX.read(file, { type: 'binary' });
    // TODO: Error check
    const sheetNames = workbook.SheetNames;
    sheetNames.forEach(name => {
      const worksheet = workbook.Sheets[name];
      const d = Object.entries(worksheet)
        .filter(([k, v]) => k[0] !== '!')
        .map(([id, cell]) => new Cell(name, id, cell));
      this.data = [...this.data, ...d];
    });
  }

  calculateDepths() {
    this.outputs.map(cell => this.getDepth(cell));
  }

  getDepth(cell) {
    if (!cell || !cell.isFormula()) {
      return 0;
    }
    if (cell.depth > 0) {
      return cell.depth;
    }
    let depth = 0;
    const children = this.precedents(cell).map(c => this.getDepth(c));
    depth = 1 + Math.max.apply(null, children);
    cell.setDepth(depth);
    return depth;
  }

  precedents(cell) {
    const ranges = parser.getRangeTokens(cell.formula);
    return flatten(ranges.map(r => this.explodeRange(cell.sheet, r)));
  }

  explodeRange(sheet, range) {
    const cleanRef = splitOutSheetName(sheet, range);
    const cellArray = XLSX.utils.decode_range(cleanRef.range);
    const decoded = this.decodeCellsFromArray(cleanRef.sheet, cellArray);
    if (decoded.length === 0) {
      this.addError('Cannot identify range', cleanRef.range);
    }
    return decoded;
  }

  // Refactor in Fp style
  decodeCellsFromArray(sheet, cellArray) {
    const cells = [];
    for (let row = cellArray.s.r; row <= cellArray.e.r; ++row) {
      for (let col = cellArray.s.c; col <= cellArray.e.c; ++col) {
        const ref = XLSX.utils.encode_cell({ c: col, r: row });
        cells.push(this.getCellByRef(sheet, ref));
      }
    }
    return cells;
  }

  getCellByRef(sheet, ref) {
    return this.data.filter(d => d.sheet === sheet && d.ref === ref)[0];
  }

  getCellIndexByRef(sheet, ref) {
    const cell = this.getCellByRef(sheet, ref);
    if (!cell) {
      return null;
    }
    return this.data.indexOf(cell);
  }

  getCellValueByRef(sheet, ref) {
    const cell = this.getCellByRef(sheet, ref);
    return cell ? cell.value : null;
  }

  setCellValueByRef(sheet, ref, value) {
    const cell = this.getCellByRef(sheet, ref);
    if (cell) {
      cell.value = value;
    }
  }
}
