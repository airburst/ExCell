import XLSX from 'xlsx';
import Parser from '../parser';
import {flatten} from '../utils';
import {Comment} from './comment.js';
import {Cell} from './cell';

export class Excel {

    constructor() {
        this.data = [];
        this.parser = new Parser();
    }

    inputs() {
        return this.data.filter((c) => { return c.isInput(); });
    }

    outputs() {
        return this.data.filter((c) => { return c.isOutput(); });
    }

    // Load data with non-empty cells    
    loadFile(fileName) {
        let workbook = XLSX.readFile(fileName, { cellDates: true }); // TODO: Error check
        let sheetNames = workbook.SheetNames,
            output = '';

        for (let name of sheetNames) {
            let worksheet = workbook.Sheets[name];
            for (let cell in worksheet) {
                if (cell[0] === '!') continue;
                this.data.push(new Cell(name, cell, worksheet[cell]));
            }
        };
        // TODO: free up memory from XLSX object?
    }

    calculateDepths() {
        for (let cell of this.outputs()) {
            if (cell.isFormula()) { console.log(cell.sheet, cell.ref, cell.formula, this.dependencies(cell)); }
        }
    }

    getDepth(sheet = '', ref = '') {
        let cell = this.getCellByRef(sheet, ref);
        if (cell === undefined) { return undefined; }
        if (cell.isFormula()) { return 0; }
        if (cell.depth > 0) { return cell.depth; }          // wrong order?

        // Calculate recursively for the first time
        let d = this.dependencies(cell.formula, sheet),
            depth = 0,
            children = [];

        for (i = 0; i < d.length; i++) {
            children.push(this.getDepth(d[i].sheet, d[i].ref));
        }

        depth = 1 + max(children);
        this.setDepth(sheet, ref, depth);   // side effect -- could use cell.setDepth()
        return depth;
    }

    // Takes a formula and returns an array of dependent cells
    dependencies(cell) {
        let ranges = this.parser.getRangeTokens(cell.formula);
        return flatten(
            ranges.map((r) => {
                return this.explodeRange(cell.sheet, r);
            })
        );
    }

    // Expands a range into an array of cells
    explodeRange(sheet = '', range = '') {
        let cleanRef = this.refactorSheetName(sheet, range);
        let cellArray = XLSX.utils.decode_range(cleanRef.range);
        return this.decodeCellsFromArray(cleanRef.sheet, cellArray);
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

    // Split out any sheet refs like Sheet1!A1:B2
    refactorSheetName(sheet, range) {
        let r = range.split('!');
        if (r.length === 2) { return { sheet: r[0], range: r[1] }; }
        return { sheet: sheet, range: range };
    }

    getCellByRef(sheet = '', ref = '') {
        return this.data.filter((d) => {
            return (d.sheet === sheet && d.ref === ref);
        })[0];
    }
}