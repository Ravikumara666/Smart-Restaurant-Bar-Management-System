// admin/components/Sidebar.jsx
import { LayoutDashboard, ListOrdered, Table2, Utensils, Receipt } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";


const navItem =
  "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition";

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r bg-white h-screen sticky top-0 p-4">
      <div className="text-2xl font-bold mb-6">Admin</div>
      <nav className="space-y-1">
        <NavLink to="/admin/dashboard" end className={navItem}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/admin/orders" className={navItem}>
          <ListOrdered size={18} /> Orders
        </NavLink>
        <NavLink to="/admin/tables" className={navItem}>
          <Table2 size={18} /> Tables
        </NavLink>
        <NavLink to="/admin/menu" className={navItem}>
          <Utensils size={18} /> Menu
        </NavLink>
        <NavLink to="/admin/sales" className={navItem}>
          <Receipt size={18} /> Sales
        </NavLink>
      </nav>
    </aside>
  );
}