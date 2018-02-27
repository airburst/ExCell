import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Home from './components/Home';
import Code from './components/Code';
import './index.css';

// Add new routes here
const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/code" exact component={Code} />
  </Switch>
);

const App = () => (
  <div className="App">
    <Routes />
  </div>
);

export default withRouter(App);
