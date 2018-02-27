import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Excel from '../../services/Excel';
import solver from '../../services/solver';
import makeCode from '../../services/makeCode';
import Dropzone from '../../components/Dropzone';
import Inputs from '../../components/Inputs';
import Outputs from '../../components/Outputs';

class Home extends Component {
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
    const { history, setCode } = this.props;
    const excel = new Excel(file);
    this.setInfo(excel);
    setCode(makeCode(excel));
    history.push('/code');
  };

  doCalculation = inputs => {
    // const start = new Date().getTime();
    const results = this.state.calculate(inputs);
    const outputs = Object.entries(results).map(([name, value]) => ({
      [name]: value,
    }));
    this.setState({ outputs });
    // console.log(`Calculation took ${new Date().getTime() - start} ms`);
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
    const inputClass = this.state.inputs.length === 0 ? 'hidden info' : 'info';
    return (
      <div className="App">
        <Dropzone handleFile={this.handleFile} />

        <div className={inputClass}>
          <Inputs inputs={this.state.inputs} calculate={this.doCalculation} />
          <Outputs outputs={this.state.outputs} />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  setCode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default Home;
