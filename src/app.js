import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import * as reducers from './reducers';
import { fetchTracks, watchTracks } from './actions';

import App from './components/App';

const store = createStore(combineReducers(reducers), applyMiddleware(thunkMiddleware));

function run() {
  ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
}

function init() {
  run();
  store.subscribe(run);
  store.dispatch(fetchTracks());
  store.dispatch(watchTracks());
}

init();
