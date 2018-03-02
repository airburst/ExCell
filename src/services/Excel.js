import XLSX from 'xlsx';
import parser from './parser';
import { flatten, makeRef, splitOutSheetName } from './utils';
import Cell from './Cell';

export default class Excel {
  constructor(file, showFullRefs = false) {
    this.data = [];
    this.d = {};
    this.inputs = [];
    this.outputs = [];
    this.formulae = {};
    this.namedRanges = new Map();
    this.refMap = new Map();
    this.showFullRefs = showFullRefs;
    this.counter = 0;
    this.loadFile(file);
  }

  loadFile(file) {
    if (file) {
      try {
        this.load(file);
        this.getIO();
        this.calculateDepths();
        this.sortFormulaeByDepth();
        this.data = null; // Clean up memory
      } catch (e) {
        throw new Error(`Error loading Excel file: ${e.message}`);
      }
    }
  }

  load(file) {
    const workbook = XLSX.read(file, { type: 'binary', cellNF: true });
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

  // Establish the relative 'depth' of a formula, i.e. the number of
  // prior formulae that must be run before this one. Also build up
  // collections of overall data and specific forulae input refs.
  getDepth(cell) {
    const { sheet, ref, formula, value, output, name, type, format } = cell;
    const field = this.shortenRef(sheet, ref);
    this.d[field] = this.d[field] || value; // Add to data store
    if (!formula) {
      return 0; // Only formulae have depth
    }
    if (this.formulae[field]) {
      return this.formulae[field].depth; // Memoize
    }
    let depth = 0;
    const { cells, expression, inputs } = this.precedents({ sheet, formula });
    cells.map(c => this.getDepth(c));
    depth = 1 + Math.max.apply(null, cells.map(c => c.depth));
    cell.setDepth(depth);
    this.formulae[field] = {
      field,
      expression,
      depth,
      inputs,
    };
    if (output) {
      this.formulae[field].output = name;
      this.formulae[field].type = type;
      this.formulae[field].format = format;
    }
    return depth;
  }

  // Rewrite full sheet!ref as next alphabet letter
  shortenRef(sheet, ref) {
    const r = makeRef(sheet, ref);
    // Write long data refs in showFullRefs mode
    if (this.showFullRefs) {
      return r;
    }
    const found = this.refMap.get(r);
    if (found) {
      return found;
    }
    const newRef = XLSX.utils.encode_col(this.counter);
    this.refMap.set(r, newRef);
    this.counter += 1;
    return newRef;
  }

  precedents({ sheet, formula }) {
    const ranges = parser.getRangeTokens(formula);
    let expression = formula;
    const inputs = {};
    ranges.forEach((range, key) => {
      const replaced = this.expandRange(sheet, range);
      const rangeVar = `r${key}`;
      expression = expression.replace(range, rangeVar);
      inputs[rangeVar] = replaced.length > 1 ? replaced : replaced[0];
    });
    const cells = flatten(
      ranges.map(r => flatten(this.explodeRange(sheet, r)))
    );
    return { cells, expression, inputs };
  }

  expandRange(sheet, range) {
    return this.explodeRange(sheet, range).map(row => {
      if (!Array.isArray(row)) {
        if (row.input) {
          return row.name;
        }
        // If the cell has a formula, return the ref, else value
        return row.formula ? this.shortenRef(row.sheet, row.ref) : row.value;
      }
      return row.map(cell => {
        if (cell.input) {
          return cell.name;
        }
        return cell.formula
          ? this.shortenRef(cell.sheet, cell.ref)
          : cell.value;
      });
    });
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
      console.log('Cannot identify range', range);
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
    this.formulae = Object.entries(this.formulae)
      .map(([err, value]) => value)
      .sort((a, b) => a.depth - b.depth || a.formula - b.formula)
      .map(f => {
        const fn = {
          ref: f.field,
          expression: f.expression,
          d: f.depth,
          inputs: f.inputs,
        };
        if (f.output) {
          fn.output = f.output;
          fn.type = f.type;
          fn.format = f.format;
        }
        return fn;
      });
  }

  getCellByRef(sheet, ref) {
    return this.data.filter(d => d.sheet === sheet && d.ref === ref)[0];
  }
}
