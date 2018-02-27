import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Home from './components/Home';
import Code from './components/Code';
import TestModel from './components/TestModel';
import './index.css';

// Add new routes here
const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/model" exact component={TestModel} />
    <Route path="/code" exact component={Code} />
  </Switch>
);

const App = () => (
  <div className="App">
    <Routes />
  </div>
);

export default withRouter(App);
