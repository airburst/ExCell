import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import './Header.css';

const Header = props => (
  <div className="header">
    <Link to="/load" className="left">
      <Icon name="file excel outline" size="large" />
      <div className="title">ExCell</div>
    </Link>
  </div>
);

// Header.propTypes = {
//   title: PropTypes.string.isRequired,
// };

export default Header;
