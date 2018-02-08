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
    };
  }

  setInfo = excel => {
    this.setState({
      inputs: arrayToString(excel.inputs.map(i => i.comment.name)),
      outputs: arrayToString(excel.outputs.map(i => i.comment.name)),
      functions: excel.formulae.map(f => f.expression),
    });
  };

  loadFile = file => {
    const excel = new Excel(file);
    this.setInfo(excel);
    console.log(excel);
    const solver = new Solver(excel);
    // solver.solve(); // WIP
  };

  handleFile = file => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      this.loadFile(data);
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.readAsBinaryString(file);
  };

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
