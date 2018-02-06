import React, { Component } from 'react';
import Excel from './models/excel';
import { arrayToString } from './services/utils';
import Solver from './services/solver';
import './App.css';

const handleFile = (e) => {
  let files = e.target.files;
  let i, f;
  for (i = 0, f = files[i]; i !== files.length; ++i) {
    // eslint-disable-next-line no-undef
    let reader = new FileReader();
    // let name = f.name;
    reader.onload = function (e) {
      let data = e.target.result;
      loadFile(data);
    };
    reader.readAsBinaryString(f);
  }
}

const loadFile = (file) => {
  let excel = new Excel();
  excel.loadFile(file);
  excel.calculateDepths();
  displayInfo(excel);

  let solver = new Solver(excel); // inputs
  solver.solve(); // WIP
}

const displayInfo = (excel) => {
  console.log('input-count', excel.inputs().length);
  console.log('inputs', arrayToString(excel.inputs().map(i => i.comment.name)));
  console.log('output-count', excel.outputs().length);
  console.log('outputs', arrayToString(excel.outputs().map(o => o.comment.name)));
  let sortedFormulaList = excel.formulaeByDepth().map(f => f.expression);
  console.log('formula-count', sortedFormulaList.length);
  console.log('formulae', arrayToString(sortedFormulaList));
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">

          <section className="row" id="load">
            <div className="col-md-12">
              <h1>Load a spreadsheet</h1>
              <div id="dropzone"></div>
              <p><input type="file" name="xlfile" id="xlf" onChange={handleFile} /> ... or click here to select a file</p>
            </div>
          </section>

          <section className="row hide" id="info">
            <div className="col-md-12">
              <h1>Spreadsheet Information</h1>

              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3>Inputs <span id="input-count" className="badge"></span></h3>
                </div>
                <div className="panel-body code" id="inputs"></div>
              </div>

              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3>Outputs <span id="output-count" className="badge"></span></h3>
                </div>
                <div className="panel-body code" id="outputs"></div>
              </div>

              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3>Formulae (in run order) <span id="formula-count" className="badge"></span></h3>
                </div>
                <div className="panel-body code" id="formulae"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
