import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import FastClick from 'fastclick';
import Route from './router/index.js';
import store from './reducers/index';
import './utils/setRem';
import './styles/base.css';

import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

//ReactDOM.render(<Router routes={Route} />, document.getElementById('root'));

const render = Component => {
  ReactDOM.render(
     <Provider store={store}>
        <Component />
     </Provider>,
    document.getElementById('root')
  )
}

render(Route);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
