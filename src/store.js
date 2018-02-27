import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

export default (history, initialState = {}) => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const reactRouterMiddleware = routerMiddleware(history);
  const enhancers = composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(reactRouterMiddleware)
  );
  const store = createStore(reducer, initialState, enhancers);

  return store;
};
