import React, { Component } from 'react';
import Excel from './services/Excel';
import solver from './services/solver2';
import Dropzone from './components/Dropzone';
import Inputs from './components/Inputs';
import Outputs from './components/Outputs';

class App extends Component {
  constructor() {
    super();
    this.state = {
      calculate: () => {},
      inputs: [],
      outputs: [],
    };
  }

  setInfo = excel => {
    this.setState({
      calculate: solver(excel),
      inputs: excel.inputs.map(i => ({
        [i.name]: i.value,
      })),
      outputs: excel.outputs.map(o => ({
        [o.name]: o.value,
      })),
    });
  };

  loadFile = file => {
    const excel = new Excel(file);
    this.setInfo(excel);
    console.log(excel);
    console.log(Object.keys(excel.d).length);
  };

  doCalculation = inputs => {
    const start = new Date().getTime();
    const results = this.state.calculate(inputs);
    const outputs = Object.entries(results).map(([name, value]) => ({
      [name]: value,
    }));
    this.setState({ outputs });
    console.log(`Calculation took ${new Date().getTime() - start} ms`);
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
          <Inputs inputs={this.state.inputs} calculate={this.doCalculation} />
          <Outputs outputs={this.state.outputs} />
        </div>
      </div>
    );
  }
}

export default App;
