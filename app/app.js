//import os from 'os';
//import env from './env';
import {remote} from 'electron';
import jetpack from 'fs-jetpack';
import {setDomValue, showElement, hideElement} from './ui';
import {Excel} from './models/excel';
import {arrayToString} from './utils';
import {Solver} from './solver';

let app = remote.app;
let appDir = jetpack.cwd(app.getAppPath());
//console.log('The author of this app is:', appDir.read('package.json', 'json').author);

// Main
document.addEventListener('DOMContentLoaded', () => {
    let drop = document.getElementById('dropzone');
    drop.addEventListener('drop', handleDrop, false);
    if(drop.addEventListener) {
        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
    }

    let xlf = document.getElementById('xlf');
    xlf.addEventListener('change', handleFile, false);
});

function handleDrop(e) {
    console.log('dropped..');
    e.stopPropagation();
    e.preventDefault();
    handleFile(e);
}

function handleDragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleFile(e) {
    let files = e.target.files;
    let i, f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
        let reader = new FileReader();
        let name = f.name;
        reader.onload = function(e) {
            let data = e.target.result;
            loadFile(data);
        };
        reader.readAsBinaryString(f);
    }
}

function loadFile(file) {
    let excel = new Excel();
    excel.loadFile(file);
    excel.calculateDepths();
    displayInfo(excel);

    let solver = new Solver(excel);
    solver.solve();
}

function displayInfo(excel) {
    setDomValue('input-count', excel.inputs().length);
    setDomValue('inputs', arrayToString(excel.inputs().map((i) => { return i.comment.name; })));
    setDomValue('output-count', excel.outputs().length);
    setDomValue('outputs', arrayToString(excel.outputs().map((o) => { return o.comment.name; })));
    let sortedFormulaList = excel.formulaeByDepth().map((f) => { return f.expression; });
    setDomValue('formula-count', sortedFormulaList.length);
    setDomValue('formulae', arrayToString(sortedFormulaList));
    showElement('info');
    hideElement('load');
}