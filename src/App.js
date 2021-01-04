import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { SnackbarProvider } from 'notistack';
import './App.css';

import reducers from './reducers';
import watcherSaga from './sagas';
import { Delegator } from './pages/Delegator';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  reducers,
  reduxDevTools ? compose(applyMiddleware(sagaMiddleware), reduxDevTools) : applyMiddleware(sagaMiddleware),
);

// run the saga
sagaMiddleware.run(watcherSaga);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <SnackbarProvider maxSnack={1}>
          <Delegator />
        </SnackbarProvider>
      </Router>
    </Provider>
  );
}

export default App;
