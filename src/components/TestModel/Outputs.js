import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

const OutputItem = props => {
  const { name, value } = props;
  const formatted = value.formatted || value;
  return (
    <Form.Field>
      <label htmlFor={`o-${name}`}>
        {name}
        <input id={`o-${name}`} value={formatted} readOnly />
      </label>
    </Form.Field>
  );
};

OutputItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
};

OutputItem.defaultProps = {
  value: 0,
};

const Outputs = props => {
  const OutputItems = props.outputs.map(output =>
    Object.entries(output).map(([name, value]) => (
      <OutputItem key={name} name={name} value={value} />
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
