import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk';
import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, thunk];
const store = createStore(reducer, applyMiddleware(...middlewares));
store.runSaga = sagaMiddleware.run;

export default store;
