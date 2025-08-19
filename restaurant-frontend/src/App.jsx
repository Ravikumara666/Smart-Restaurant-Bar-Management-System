import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import AdminApp from "./admin/AdminApp"; // ⬅️ import admin

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer app routes */}
        <Route path="/" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-status/:id" element={<OrderStatusPage />} />
      </Routes>
    </Router>
  );
}

export default App;