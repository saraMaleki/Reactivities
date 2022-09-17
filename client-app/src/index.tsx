import React from "react";
import ReactDOM from "react-dom/client";

import "semantic-ui-css/semantic.min.css";
import 'react-calendar/dist/Calendar.css'
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";

import "./app/layout/styles.css";
import { store, StoreContext } from "./app/stores/store";
import { Router, } from "react-router";
import { createBrowserHistory} from 'history';
import { BrowserRouter } from "react-router-dom";


 export const history= createBrowserHistory();
// const history = useBasename(createHistory)({ basename: '/animations' })
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
    <Router history={history}>
      <App />
    </Router>
  </StoreContext.Provider>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
