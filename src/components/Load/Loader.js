import React from 'react';
import propTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';

const LargeLoader = ({ message }) => (
  <div>
    <div className="loading-spinner">
      <Dimmer active inverted>
        <Loader size="huge">{message}</Loader>
      </Dimmer>
    </div>
  </div>
);

LargeLoader.propTypes = {
  message: propTypes.string.isRequired,
};

export default LargeLoader;
