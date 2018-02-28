import React, { Component } from 'react';
import PropTypes from 'prop-types';
import solver from '../../services/solver';
import Inputs from './Inputs';
import Outputs from './Outputs';
import './TestModel.css';

class TestModel extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    setTiming: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      calculate: () => {},
      inputs: [],
      outputs: [],
    };
  }

  componentDidMount() {
    this.setInfo();
  }

  setInfo() {
    const { model } = this.props.settings;
    if (model) {
      this.setState({
        calculate: solver(model),
        inputs: model.inputs.map(i => ({
          [i.name]: i.value,
        })),
        outputs: model.outputs.map(o => ({
          [o.name]: o.value,
        })),
      });
    }
  }

  doCalculation = inputs => {
    const { setTiming } = this.props;
    const start = new Date().getTime();
    const results = this.state.calculate(inputs);
    const outputs = Object.entries(results).map(([name, value]) => ({
      [name]: value,
    }));
    this.setState({ outputs });
    const time = new Date().getTime() - start;
    setTiming(time);
  };

  render() {
    const inputClass = this.state.inputs.length === 0 ? 'hidden info' : 'info';
    return (
      <div className={inputClass}>
        <Inputs inputs={this.state.inputs} calculate={this.doCalculation} />
        <Outputs outputs={this.state.outputs} />
      </div>
    );
  }
}

export default TestModel;
