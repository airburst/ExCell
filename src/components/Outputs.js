import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import uuid from 'uuid/v4';

const OutputItem = props => {
  const name = props.name.trim();
  return (
    <Form.Field>
      <label htmlFor={`o-${name}`}>
        {name}
        <input id={`o-${name}`} readOnly />
      </label>
    </Form.Field>
  );
};

OutputItem.propTypes = {
  name: PropTypes.string.isRequired,
};

const Outputs = props => {
  const OutputItems = props.outputs.map(name => (
    <OutputItem key={uuid()} name={name} />
  ));

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
