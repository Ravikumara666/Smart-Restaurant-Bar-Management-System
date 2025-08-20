import React from "react";
import { Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderStatusPage from "./pages/OrderStatusPage";

function App() {
  return (
    <Routes>
      {/* Customer app routes */}
      <Route path="/" element={<MenuPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-status/:id" element={<OrderStatusPage />} />
    </Routes>
  );
}

export default App;