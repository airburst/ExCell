import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import './Header.css';

const Header = () => (
  <div className="header">
    <Link to="/load" className="left" title="Click to load new Sheet">
      <Icon name="file excel outline" size="large" />
      <div className="title">ExCell</div>
    </Link>
  </div>
);

export default Header;
