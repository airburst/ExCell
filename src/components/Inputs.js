import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import uuid from 'uuid/v4';

const InputItem = props => {
  const name = props.name.trim();
  return (
    <Form.Field>
      <label htmlFor={`i-${name}`}>
        {name}
        <input id={`i-${name}`} />
      </label>
    </Form.Field>
  );
};

InputItem.propTypes = {
  name: PropTypes.string.isRequired,
};

class Inputs extends React.Component {
  constructor() {
    super();
    this.state = {
      inputs: [],
      outputs: [],
    };
  }

  render() {
    console.log('Inputs:render');
    const { calculate, inputs } = this.props;
    const InputItems = inputs.map(name => (
      <InputItem key={uuid()} name={name} />
    ));

    return (
      <div className="inputs">
        <Form>
          {InputItems}
          <Button color="blue" onClick={calculate()}>
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
