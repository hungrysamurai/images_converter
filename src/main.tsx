import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { Provider } from 'react-redux';
import { persistor, store } from './store/store.js';

import { PersistGate } from 'redux-persist/integration/react';

import initGoogleAnalytics from './analytics';
initGoogleAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
