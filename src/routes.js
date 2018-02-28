import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Header, Home, Code, TestModel } from './components';
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
    <Header />
    <div className="content">
      <Routes />
    </div>
  </div>
);

export default withRouter(App);
