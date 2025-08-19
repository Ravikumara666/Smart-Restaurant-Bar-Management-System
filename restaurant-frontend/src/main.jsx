import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { store, persistor } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App";          // Customer app
import AdminApp from "./AdminApp"; // Admin panel

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          {/* Customer-facing routes */}
          <Route path="/*" element={<App />} />

          {/* Admin-facing routes */}
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Router>
    </PersistGate>
  </Provider>
);