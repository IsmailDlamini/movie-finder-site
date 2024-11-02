import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ReactGA from "react-ga4";
import { MyContextProvider } from "./context/MyContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MyContextProvider>
        <App />
      </MyContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
