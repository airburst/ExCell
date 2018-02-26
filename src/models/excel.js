import XLSX from 'xlsx';
import parser from '../services/parser';
import { flatten } from '../services/utils';
import Cell from './cell';

export const splitOutSheetName = (sheet, range, namedRanges) => {
  const realRange = namedRanges.get(range) ? namedRanges.get(range) : range;
  const r = realRange.split('!');
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
    this.namedRanges = new Map();
    this.errors = [];
    this.loadFile(file);
  }

  loadFile(file) {
    if (file) {
      try {
        this.load(file);
        this.getIO();
        this.calculateDepths();
        this.sortFormulaeByDepth();
      } catch (e) {
        this.errors.push(new Error('Error loading Excel file'));
      }
    }
  }

  load(file) {
    const workbook = XLSX.read(file, { type: 'binary' });
    this.setNamedRanges(workbook);
    const sheetNames = workbook.SheetNames;
    sheetNames.forEach(name => {
      const worksheet = workbook.Sheets[name];
      const d = Object.entries(worksheet)
        .filter(([k]) => k[0] !== '!')
        .map(([id, cell]) => new Cell(name, id, cell));
      this.data = [...this.data, ...d];
    });
  }

  setNamedRanges(wb) {
    const names = wb.Workbook.Names;
    if (names && names.length > 0) {
      names.forEach(range => this.namedRanges.set(range.Name, range.Ref));
    }
  }

  getIO() {
    this.inputs = this.data.filter(c => c.input);
    this.outputs = this.data.filter(c => c.output);
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
    return flatten(ranges.map(r => flatten(this.explodeRange(cell.sheet, r))));
  }

  explodeRange(cellSheet, cellRange) {
    const { sheet, range } = splitOutSheetName(
      cellSheet,
      cellRange,
      this.namedRanges
    );
    const cellArray = XLSX.utils.decode_range(range);
    const decoded = this.decodeCellsFromArray(sheet, cellArray);
    if (decoded.length === 0) {
      this.addError('Cannot identify range', range);
    }
    return decoded;
  }

  decodeCellsFromArray(sheet, range) {
    const cells = [];
    const table = range.e.r - range.s.r > 0 && range.e.c - range.s.c > 0;

    for (let row = range.s.r; row <= range.e.r; ++row) {
      const rowData = [];
      for (let col = range.s.c; col <= range.e.c; ++col) {
        const ref = XLSX.utils.encode_cell({ c: col, r: row });
        const cell = this.getCellByRef(sheet, ref);
        if (!cell) {
          if (table) {
            rowData.push(new Cell(sheet, ref));
          } else {
            cells.push(new Cell(sheet, ref));
          }
        } else if (table) {
          rowData.push(cell);
        } else {
          cells.push(cell);
        }
      }
      if (table) {
        cells.push(rowData);
      }
    }
    return cells;
  }

  sortFormulaeByDepth() {
    this.formulae = this.cellsWithDepth()
      .sort((a, b) => a.depth - b.depth || a.formula - b.formula)
      .map(cell => ({ cell, expression: cell.formula, d: cell.depth }));
  }

  cellsWithDepth() {
    return this.data.filter(c => c.depth > 0);
  }

  addError(type = '', message = '', cell = undefined) {
    this.errors.push({ type, message, cell });
    console.error(`${type}: ${message}.  Cell ref: ${cell}`);
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

  getCellValue(sheet, ref) {
    const cell = this.getCellByRef(sheet, ref);
    return cell ? cell.value : null;
  }

  setCellValue(sheet, ref, value) {
    const cell = this.getCellByRef(sheet, ref);
    if (cell) {
      cell.value = value;
    }
  }
}
