import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import uuid from 'uuid/v4';
import { castNumber } from '../services/utils';

const InputItem = props => {
  const { name, value, onChange } = props;
  return (
    <Form.Field>
      <label htmlFor={name}>
        {name}
        <input id={name} name={name} value={value} onChange={onChange} />
      </label>
    </Form.Field>
  );
};

InputItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired, // TODO: cast general shape
  onChange: PropTypes.func.isRequired,
};

class Inputs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inputs !== this.props.inputs) {
      const inputs = {};
      nextProps.inputs.forEach(i => {
        inputs[i] = '';
      });
      this.setState(inputs);
    }
  }

  handleInputChange = event => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  };

  handleCalculate = () => {
    if (Object.keys(this.state).length > 0) {
      const inputs = {};
      Object.entries(this.state).forEach(([name, value]) => {
        inputs[name] = castNumber(value);
      });
      this.props.calculate(inputs);
    }
  };

  render() {
    const InputItems =
      this.state &&
      Object.entries(this.state).map(([name, value]) => (
        <InputItem
          key={uuid()}
          name={name}
          value={value}
          onChange={this.handleInputChange}
        />
      ));

    return (
      <div className="inputs">
        <Form>
          {InputItems}
          <Button color="blue" onClick={this.handleCalculate}>
            Calculate
          </Button>
        </Form>
      </div>
    );
  }
}

Inputs.propTypes = {
  inputs: PropTypes.array.isRequired,
  calculate: PropTypes.func.isRequired,
};

export default Inputs;
