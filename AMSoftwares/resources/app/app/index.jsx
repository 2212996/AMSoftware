import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { remote } from 'electron';

import dancemanagerApp from './reducers/index';
import VisibleApp from './containers/VisibleApp';

const window = remote.BrowserWindow;

/* eslint-disable no-underscore-dangle */
const store = createStore(
  dancemanagerApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

require('bulma');
require('font-awesome/css/font-awesome.css');
require('./style/style.scss');

render(
  <Provider store={store}>
    <VisibleApp />
  </Provider>,
    document.getElementById('root'),
);
