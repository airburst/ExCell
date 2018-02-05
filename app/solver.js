import * as functions from 'formula'
import Parser from './parser';
import {Excel} from './models/excel';

// console.log(functions.run('IF(IFERROR(SEARCH("6", "[1,3,5]", 0),1,0))'));

const testInputs = [
    { name: 'tenneeds', value: '[1, 3, 5]' },
    { name: 'impairmentyesno', value: 0 },
    { name: 'wellbeing', value: 3 },
    { name: 'bad-match', value: 'nothing' }
];

export class Solver {

    constructor(excel = new Excel(), inputs = []) {
        this.model = excel;
        this.publishFunctions();
        if (inputs.length > 0) { return this.solve(excel, inputs); }
    }

    inputs() {
        return this.model.inputs().map((cell) => {
            return {
                name: cell.comment.name,    // value: cell.comment.default,
                type: cell.type,
                dataType: cell.comment.dataType,
                rows: cell.comment.rows,
                cols: cell.comment.cols,
                sheet: cell.sheet,
                ref: cell.ref
            }
        });
    }

    outputs() {
        return this.model.outputs().map((cell) => {
            return {
                name: cell.comment.name,    // value: cell.comment.default,
                type: cell.type,
                dataType: cell.comment.dataType,
                rows: cell.comment.rows,
                cols: cell.comment.cols,
                sheet: cell.sheet,
                ref: cell.ref
            }
        });
    }

    publishFunctions() {
        for (let key in functions) { window[key] = functions[key]; }
    }

    solve(inputs = testInputs) {
        this.mapInputsToData(inputs);
        this.runFormulaeInSequence();
        return []; //outputs
    }

    mapInputsToData(inputs) {
        for (let i of inputs) {
            let inputRef = this.getInputRefByName(i.name);
            if (inputRef) { 
                let cell = this.model.setCellValueByRef(inputRef.sheet, inputRef.ref, i.value); 
            }
        }
    }

    getInputRefByName(name) {
        return this.inputs().filter((i) => { return i.name === name; })[0];
    } 

    runFormulaeInSequence() {
        for (let f of this.model.formulaeByDepth()) {
            let p = this.model.precedents(f.cell);
            console.log(p);
            console.log(f.expression, p.map((c) => { return this.model.getCellValue(c); }));
        }
        // this.model.setCellValueByRef('Version', 'A22', 'Mark');
        // console.log(this.model.getCellValueByRef('Version', 'A22'));
    }

}