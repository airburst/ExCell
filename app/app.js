//import os from 'os';
//import env from './env';
import {remote} from 'electron';
import jetpack from 'fs-jetpack';
import {Excel} from './models/excel';

let app = remote.app;
let appDir = jetpack.cwd(app.getAppPath());
//console.log('The author of this app is:', appDir.read('package.json', 'json').author);

// Main
let excel = new Excel();
excel.loadFile('checker.xlsx');
setDom('excel-file', JSON.stringify(excel.data));

console.log('Inputs: ', excel.inputs());
console.log('Outputs: ', excel.outputs());
console.log(excel.dependencies('=SUM(Calculation!B4:B10) + Version!B1'));

function setDom(el, value) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById(el).innerHTML = value;
    });
};


/* set up drag-and-drop event */
// function handleDrop(e) {
//   e.stopPropagation();
//   e.preventDefault();
//   var files = e.dataTransfer.files;
//   var i,f;
//   for (i = 0, f = files[i]; i != files.length; ++i) {
//     var reader = new FileReader();
//     var name = f.name;
//     reader.onload = function(e) {
//       var data = e.target.result;

//       /* if binary string, read with type 'binary' */
//       var workbook = XLSX.read(data, {type: 'binary'});

//       /* DO SOMETHING WITH workbook HERE */
//     };
//     reader.readAsBinaryString(f);
//   }
// }
// drop_dom_element.addEventListener('drop', handleDrop, false);

// function handleFile(e) {
//   var files = e.target.files;
//   var i,f;
//   for (i = 0, f = files[i]; i != files.length; ++i) {
//     var reader = new FileReader();
//     var name = f.name;
//     reader.onload = function(e) {
//       var data = e.target.result;

//       var workbook = XLSX.read(data, {type: 'binary'});

//       /* DO SOMETHING WITH workbook HERE */
//     };
//     reader.readAsBinaryString(f);
//   }
// }
// input_dom_element.addEventListener('change', handleFile, false);
