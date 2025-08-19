// admin/components/Header.jsx
import { Bell, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import React from "react";

export default function Header({ onBellClick }) {
  const dispatch = useDispatch();
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white sticky top-0 z-10">
      <div className="font-semibold">Smart Restaurant Admin</div>
      <div className="flex items-center gap-4">
        <button
          onClick={onBellClick}
          className="p-2 rounded-xl hover:bg-gray-100"
          title="Notifications"
        >
          <Bell />
        </button>
        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}