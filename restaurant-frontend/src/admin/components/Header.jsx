import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import React from "react";
import NotificationWrapper from "./NotificationWrapper";
import { useNavigate } from "react-router-dom";

export default function Header() {
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
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white sticky top-0 z-10">
      <div className="font-semibold">Smart Restaurant Admin</div>
      <div className="flex items-center gap-4">
        <NotificationWrapper />

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}