import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as home from './Home/reducer';
import * as city from './Citys/reducer';
import thunk from 'redux-thunk';

let store = createStore(
  combineReducers({...home, ...city}),
  applyMiddleware(thunk)
);

export default store;


