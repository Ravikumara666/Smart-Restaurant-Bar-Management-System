// admin/components/Sidebar.jsx
import { 
  LogOut, 
  Bell, 
  LayoutDashboard, 
  ListOrdered, 
  Table2, 
  Utensils, 
  Receipt, 
  CreditCard,
  Menu,
  X,
  User,
  Settings,
  ChevronDown,
  Search
} from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";


const navItem =
  "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Enhanced navItem with active state handling
  const navItem = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
    ${isActive 
      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25' 
      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:scale-105'
    }
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 lg:w-64 shrink-0 border-r bg-white z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6 h-full flex flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8 lg:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Utensils size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin
                </h2>
                <p className="text-xs text-gray-500">Control Panel</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
              Main Menu
            </div>
            
            <NavLink to="/admin/dashboard" end className={navItem}>
              {({ isActive }) => (
                <>
                  <LayoutDashboard 
                    size={18} 
                    className={`group-hover:scale-110 transition-transform duration-200 ${isActive ? 'text-white' : ''}`} 
                  />
                  <span className="font-medium">Dashboard</span>
                  {isActive && (
                    <div className="absolute right-2 w-1 h-6 bg-white rounded-full opacity-80"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/admin/orders" className={navItem}>
              {({ isActive }) => (
                <>
                  <ListOrdered 
                    size={18} 
                    className={`group-hover:scale-110 transition-transform duration-200 ${isActive ? 'text-white' : ''}`} 
                  />
                  <span className="font-medium">Orders</span>
                  {isActive && (
                    <div className="absolute right-2 w-1 h-6 bg-white rounded-full opacity-80"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/admin/tables" className={navItem}>
              {({ isActive }) => (
                <>
                  <Table2 
                    size={18} 
                    className={`group-hover:scale-110 transition-transform duration-200 ${isActive ? 'text-white' : ''}`} 
                  />
                  <span className="font-medium">Tables</span>
                  {isActive && (
                    <div className="absolute right-2 w-1 h-6 bg-white rounded-full opacity-80"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/admin/menu" className={navItem}>
              {({ isActive }) => (
                <>
                  <Utensils 
                    size={18} 
                    className={`group-hover:scale-110 transition-transform duration-200 ${isActive ? 'text-white' : ''}`} 
                  />
                  <span className="font-medium">Menu</span>
                  {isActive && (
                    <div className="absolute right-2 w-1 h-6 bg-white rounded-full opacity-80"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/admin/sales" className={navItem}>
              {({ isActive }) => (
                <>
                  <Receipt 
                    size={18} 
                    className={`group-hover:scale-110 transition-transform duration-200 ${isActive ? 'text-white' : ''}`} 
                  />
                  <span className="font-medium">Sales</span>
                  {isActive && (
                    <div className="absolute right-2 w-1 h-6 bg-white rounded-full opacity-80"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/admin/payments" className={navItem}>
              {({ isActive }) => (
                <>
                  <CreditCard 
                    size={18} 
                    className={`group-hover:scale-110 transition-transform duration-200 ${isActive ? 'text-white' : ''}`} 
                  />
                  <span className="font-medium">Online Payments</span>
                  {isActive && (
                    <div className="absolute right-2 w-1 h-6 bg-white rounded-full opacity-80"></div>
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Bottom section */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">Contact our support team</p>
              <button className="w-full bg-white text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}