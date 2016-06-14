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
        let workbook = XLSX.readFile(fileName, {cellDates: true}); // TODO: Error check
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

    // Takes a range and returns an array of dependent cells ["sheet", "ref"]
    dependencies(formula = '', sheet = '') {
        let d = [],
            ranges = this.parser.getRangeTokens(formula);
console.log(ranges);
        // cells = this.explodeRange(token.value, sheet);
        // foreach (cells as cell) {
        //     array_push(d, cell);
        // }
        return d;
    }

    // getRangeTokens(formula = '') {
    //     let tokens = this.parser.getTokens(formula);
    //     return tokens.items.filter((t) => {
    //         return t.subtype === "range"
    //     }).map((r) => {
    //         return r.value;
    //     });
    // }

    setDepth(sheet = '', ref = null, depth) {
        if (ref !== null) {
            let cell = this.getCellByRef(sheet, ref);            
            cell.setDepth(depth);        
        }
    }

    getCellByRef(sheet = '', ref = '') {
        return this.data.filter((d) => {
            return (d.sheet === sheet && d.ref === ref);
        })[0];
    }
}