import React, { Component } from 'react';
import PropTypes from 'prop-types';
import solver from '../../services/solver';
import Inputs from './Inputs';
import Outputs from './Outputs';

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

  doCalculation = inputs => {
    // const start = new Date().getTime();
    const results = this.state.calculate(inputs);
    const outputs = Object.entries(results).map(([name, value]) => ({
      [name]: value,
    }));
    this.setState({ outputs });
    // console.log(`Calculation took ${new Date().getTime() - start} ms`);
  };

  render() {
    const inputClass = this.state.inputs.length === 0 ? 'hidden info' : 'info';
    return (
      <div className="App">
        <div className={inputClass}>
          <Inputs inputs={this.state.inputs} calculate={this.doCalculation} />
          <Outputs outputs={this.state.outputs} />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default Home;