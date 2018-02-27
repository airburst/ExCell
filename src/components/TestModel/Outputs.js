import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { dp } from '../services/utils';

const OutputItem = props => {
  const { name, value } = props;
  return (
    <Form.Field>
      <label htmlFor={`o-${name}`}>
        {name}
        <input id={`o-${name}`} value={dp(value)} readOnly />
      </label>
    </Form.Field>
  );
};

OutputItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const Outputs = props => {
  const OutputItems = props.outputs.map(output =>
    Object.entries(output).map(([name, value]) => (
      <OutputItem key={name} name={name} value={value.toString()} />
    ))
  );

  return (
    <div className="outputs">
      <Form>{OutputItems}</Form>
    </div>
  );
};

Outputs.propTypes = {
  outputs: PropTypes.array.isRequired,
};

export default Outputs;
