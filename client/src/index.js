import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
// createStore 더 이상 사용되지 않음 => configureStore
import { createStore, applyMiddleware } from "redux";
// import { configureStore } from "@reduxjs/toolkit";
import promiseMiddleware from "redux-promise";
import { thunk } from "redux-thunk";

import Reducer from "./_reducers"; // "./_reducers/index.js" 안해도 아무것도 안적으면 자동으로 index.js를 import한다.

// import 'antd/dist/antd.css'
// applyMiddleware도 더이상 사용안한다고 함
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  thunk
)(createStore);

// const store = configureStore({
//   reducer: Reducer,
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider
      store={createStoreWithMiddleware(
        Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
    >
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
