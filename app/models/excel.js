import XLSX from 'xlsx';
import Parser from '../parser';
import { flatten } from '../utils';
import Comment from './comment.js';
import Cell from './cell';

export class Excel {

    constructor() {
        this.data = [];
        this.errors = [];
        this.parser = new Parser();
    }

    inputs() {
        return this.data.filter(c => c.isInput());
    }

    outputs() {
        return this.data.filter(c => c.isOutput());
    }

    formulaeByDepth() {
        return this.cellsWithDepth()
            .sort((a, b) => { return (a.depth > b.depth) ? 1 : ((b.depth > a.depth) ? -1 : 0); })
            .map((cell) => { return { cell, expression: cell.formula }; });
    }

    cellsWithDepth() {
        return this.data.filter(c => (c.depth > 0));
    }

    addError(type = '', message = '', cell = undefined) {
        this.errors.push({ type, message, cell });
        console.error(type + ': ' + message + '.  Cell ref: ' + cell);
    }

    // Load data with non-empty cells    
    loadFile(file) {
        let workbook = XLSX.read(file, { type: 'binary' }); // TODO: Error check
        let sheetNames = workbook.SheetNames,
            output = '';

        for (let name of sheetNames) {
            let worksheet = workbook.Sheets[name];
            for (let cell in worksheet) {
                if (cell[0] === '!') continue;
                this.data.push(new Cell(name, cell, worksheet[cell]));
            }
        };
    }

    calculateDepths() {
        for (let cell of this.outputs()) { this.getDepth(cell); }
    }

    getDepth(cell) {
        if (!cell || !cell.isFormula()) { return 0; }
        if (cell.depth > 0) { return cell.depth; }

        let depth = 0,
            children = [];

        for (let c of this.precedents(cell)) { children.push(this.getDepth(c)); }
        depth = 1 + Math.max.apply(null, children);
        cell.setDepth(depth);
        return depth;
    }

    precedents(cell) {
        const ranges = this.parser.getRangeTokens(cell.formula);
        return flatten(ranges.map(r => this.explodeRange(cell.sheet, r)));
    }

    explodeRange(sheet, range) {
        let cleanRef = this.splitOutSheetName(sheet, range);
        let cellArray = XLSX.utils.decode_range(cleanRef.range);
        let decoded = this.decodeCellsFromArray(cleanRef.sheet, cellArray);
        if (decoded.length === 0) { this.addError('Cannot identify range', cleanRef.range); }
        return decoded;
    }

    decodeCellsFromArray(sheet, cellArray) {
        let cells = [];
        for (let row = cellArray.s.r; row <= cellArray.e.r; ++row) {
            for (let col = cellArray.s.c; col <= cellArray.e.c; ++col) {
                let ref = XLSX.utils.encode_cell({ c: col, r: row });
                cells.push(this.getCellByRef(sheet, ref));
            }
        }
        return cells;
    }

    splitOutSheetName(sheet, range) {
        const r = range.split('!');
        if (r.length === 2) { return { sheet: r[0], range: r[1] }; }
        return { sheet, range };
    }

    getCellByRef(sheet, ref) {
        return this.data.filter(d => d.sheet === sheet && d.ref === ref)[0];
    }

    getCellIndexByRef(sheet, ref) {
        const cell = this.getCellByRef(sheet, ref);
        if (!cell) { return null; }
        return this.data.indexOf(cell);
    }

    getCellValueByRef(sheet, ref) {
        const cell = this.getCellByRef(sheet, ref);
        return this.getCellValue(cell);
    }

    getCellValue(cell) {
        return (cell) ? cell.value : null;
    }

    setCellValueByRef(sheet, ref, value) {
        const cell = this.getCellByRef(sheet, ref);
        this.setCellValue(cell, value)
    }

    setCellValue(cell, value) {
        if (cell) { cell.value = value; }
    }
}