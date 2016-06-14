import XLSX from 'xlsx';
import {Comment} from './comment.js';
import {Cell} from './cell';

export class Excel {

    constructor() {
        this.data = [];
    }

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
    }

    getDepth(ref = '', sheet = 0) {
        c = this.getCellByRef(ref, sheet);

        if (c === null) { return null; }

        // Cell contains a formula
        if (c['t'] !== 'f') { return 0; }

        // Avoid unnecessary recalculation by reading existing depth > 0
        if (c['d'] > 0) { return c['d']; }

        // Calculate recursively for the first time
        d = this.dependencies(c['f'], sheet);
        depth = 0;
        children = [];
        for (i = 0; i < count(d); i++) {
            array_push(children, this.getDepth(d[i]['ref'], d[i]['sheet']));
        }

        depth = 1 + max(children);
        this.setDepth(ref, sheet, depth);
        return depth;
    }

    setDepth(ref = null, sheet = 0, depth) {
        if (ref !== null) {
            i = this.getCellIndexByRef(ref, sheet);            
            this.data[i]['d'] = depth;          
        }
    }
}