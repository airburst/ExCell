import React, { Component } from 'react';
import Excel from './models/excel';
import { arrayToString } from './services/utils';
import solver from './services/solver'; // name!
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
      inputs: arrayToString(excel.inputs.map(i => i.comment.name)),
      outputs: arrayToString(excel.outputs.map(i => i.comment.name)),
    });
  };

  loadFile = file => {
    const excel = new Excel(file);
    this.setInfo(excel);
    console.log(excel);
    // const calculate = solver(excel);
    // const outputs = calculate({
    //   age: 48,
    //   weight: 83,
    //   height: 1.85,
    //   impairmentyesno: 0,
    //   wellbeing: 1,
    //   tenneeds: '[1,3,5]',
    //   numberOfSides: 5,
    //   propertyValue: 500000,
    //   loan: 170000,
    //   rate: 0.0299,
    //   years: 9,
    // });
    // console.log(outputs);
  };

  doCalculation = inputs => {
    const outputs = this.state.calculate(inputs);
    console.log(outputs);
    this.setState({ outputs: [] });
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
    console.log('App:render');
    return (
      <div className="App">
        <Dropzone handleFile={this.handleFile} />
        <div className="info">
          <Inputs
            inputs={this.state.inputs}
            calculate={() => this.doCalculation}
          />
          <Outputs outputs={this.state.outputs} />
        </div>
      </div>
    );
  }
}

export default App;
