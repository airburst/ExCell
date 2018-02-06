import React, { Component } from 'react';
import Excel from './models/excel';
import { arrayToString } from './services/utils';
import Solver from './services/solver';
import Dropzone from './components/Dropzone';
import InfoTable from './components/InfoTable';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      inputs: [],
      outputs: [],
      functions: [],
    }
  }

  handleFile = (file) => {
    // eslint-disable-next-line no-undef
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      this.loadFile(data);
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.readAsBinaryString(file);
  }

  loadFile = (file) => {
    let excel = new Excel();
    excel.loadFile(file);
    excel.calculateDepths();
    this.setInfo(excel);

    let solver = new Solver(excel); // inputs
    solver.solve(); // WIP
  }

  setInfo = (excel) => {
    this.setState({
      inputs: arrayToString(excel.inputs().map(i => i.comment.name)),
      outputs: arrayToString(excel.outputs().map(i => i.comment.name)),
      functions: excel.formulaeByDepth().map(f => f.expression),
    });
  }

  render() {
    return (
      <div className="App">
        <Dropzone handleFile={this.handleFile} />
        <div className="info">
          <InfoTable title="Inputs" content={this.state.inputs} />
          <InfoTable title="Outputs" content={this.state.outputs} />
          <InfoTable title="Functions" content={this.state.functions} />
        </div>
      </div>
    );
  }
}

export default App;
