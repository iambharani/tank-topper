import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import  store  from './store/store';
import { Provider } from 'react-redux';
<script src="https://apis.mappls.com/advancedmaps/api/1012bcddd37d7139c30af8d27d91502e/map_sdk?v=3.0&layer=vector"></script>

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
