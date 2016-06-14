import XLSX from 'xlsx';
import Parser from '../parser';
import {Comment} from './comment.js';
import {Cell} from './cell';

export class Excel {

    constructor() {
        this.data = [];
        this.parser = new Parser();
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
    dependencies(formula = '', sheet = '') {
        let ranges = this.parser.getRangeTokens(formula);
        return ranges.map((r) => {
            return this.explodeRange(r, sheet);
        });
    }

    // Expands a range into an array of cells
    explodeRange(range = '', sheet = '') {
        let parts = [];
        // Split out any sheet refs like Sheet1!A1:B2
        let r = range.split('!');
        if (r.length === 2) {
            range = r[1];
            sheet = r[0];
        }
        let cells = XLSX.utils.decode_range(range);     // Refactor this into another function
        for (let row = cells.s.r; row <= cells.e.r; ++row) {
            for (let col = cells.s.c; col <= cells.e.c; ++col) {
                let ref = XLSX.utils.encode_cell({ c: col, r: row });
                parts.push(this.getCellByRef(sheet, ref));
            }
        }
        return parts;
    }

    getCellByRef(sheet = '', ref = '') {
        return this.data.filter((d) => {
            return (d.sheet === sheet && d.ref === ref);
        })[0];
    }
}