import * as functions from 'functionfoundry';
import {Excel} from './models/excel';

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
        return [];
    }

    mapInputsToData(inputs) {
        for (let i of inputs) {
            let inputRef = this.getInputRefByName(i.name);
            if (inputRef) {
                let cell = this.model.getCellByRef(inputRef.sheet, inputRef.ref);
                cell.setValue(i.value);
                console.log('cell: ', cell);
            }
        }
    }

    getInputRefByName(name) {
        return this.inputs().filter((i) => { return i.name === name; })[0];
    }

}