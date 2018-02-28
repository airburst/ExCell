import React from 'react';
// import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const Header = props => (
  <div className="header">
    <Icon name="file excel outline" size="large" />
    <div className="title">ExCell</div>
  </div>
);

// Header.propTypes = {
//   title: PropTypes.string.isRequired,
// };

export default Header;
