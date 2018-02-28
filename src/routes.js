import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Header, Main, Load } from './components';
import './index.css';

// Add new routes here
const Routes = () => (
  <Switch>
    <Route path="/" exact component={Main} />
    <Route path="/load" exact component={Load} />
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
