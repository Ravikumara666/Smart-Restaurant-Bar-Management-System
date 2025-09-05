
import { useDispatch } from "react-redux";
import { logout} from "../features/auth/authSlice";
import React, { useState } from "react";
import NotificationWrapper from "./NotificationWrapper";
import { useNavigate } from "react-router-dom";

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

// Enhanced Header Component
export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Your existing Redux and navigation logic
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear Redux state
    dispatch(logout());
    
    // ✅ Remove token from localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("Token");
    
    // ✅ Navigate to login page
    navigate("/"); // or "/login" based on your route
  };

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      {/* Mobile menu button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
            <Utensils size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Smart Restaurant Admin
            </h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Search bar - hidden on mobile */}
      {/* <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, tables, menu items..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
          />
        </div>
      </div> */}

      {/* Right side actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Your existing NotificationWrapper */}
        <div className="transform hover:scale-105 transition-transform duration-200">
          <NotificationWrapper />
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <User size={16} className="text-white" />
            </div>
            <ChevronDown size={16} className={`hidden lg:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                  <p className="font-semibold text-gray-900">Admin User</p>
                  <p className="text-sm text-gray-600">Restaurant Manager</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 text-left group">
                    <Settings size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-left group"
                  >
                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
            </>
          )}
        </div>

        {/* Enhanced Logout Button - keeping your original for compatibility */}
        <button
          onClick={handleLogout}
          className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 group"
        >
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          <span className="hidden lg:inline font-medium">Logout</span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}