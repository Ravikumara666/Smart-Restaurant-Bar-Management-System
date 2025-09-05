import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./admin/components/Sidebar";
import Header from "./admin/components/Header";

// Pages
import OrdersPage from "./admin/pages/OrdersPage";
import TablesPage from "./admin/pages/TablesPage";
import MenuPage from "./admin/pages/MenuPage";
import DashboardPage from "./admin/pages/DashboardPage";
import SalesPage from "./admin/pages/SalesPage";
import OnlinePayments from "./admin/pages/OnlinePayments.jsx";


const AdminApp = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-y-auto">
          <Routes>
            {/* Default route → redirect to Orders */}
            <Route path="/" element={<Navigate to="orders" replace />} />

            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="sales" element={<SalesPage/>} />
            <Route path="payments" element={<OnlinePayments/>}/>
            

            {/* Fallback for wrong routes */}
            <Route path="*" element={<p>404 - Page not found</p>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminApp;