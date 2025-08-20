// // admin/index.jsx
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import { store } from "./app/store";
// import AdminApp from "./AdminApp";
// // import "./index.css"; // if you want admin to also use Tailwind/global styles

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <Router>
//       <Routes>
//         {/* Admin routes mounted here */}
//         <Route path="/admin/*" element={<AdminApp />} />

//         {/* Redirect anything else */}
//         <Route path="*" element={<Navigate to="/admin" replace />} />
//       </Routes>
//     </Router>
//   </Provider>
// );