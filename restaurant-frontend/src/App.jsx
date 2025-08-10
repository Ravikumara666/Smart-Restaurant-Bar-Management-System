import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import TableManagement from './pages/TableManagement'; // make sure this path is correct
// import MenuPage from './pages/MenuPage';
// import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/tables" />} />
        <Route path="/tables" element={<TableManagement />} />
        {/* Add more routes as needed */}
        {/* <Route path="/menu" element={<MenuPage />} /> */}
        {/* <Route path="/orders" element={<OrdersPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
