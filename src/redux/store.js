import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import { loadState } from "../utils/localStorage";

import forecastSaga from "../sagas/forecast-sagas";

const sagaMiddleware = createSagaMiddleware();

const persistedState = loadState();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  persistedState,
  // compose(
  //   applyMiddleware(sagaMiddleware),
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(forecastSaga);
