import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import 'semantic-ui-css/semantic.min.css';
import configureStore from './store';
import Routes from './routes';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <Routes />
    </Provider>
  </Router>,
  document.getElementById('root')
);

// registerServiceWorker();
