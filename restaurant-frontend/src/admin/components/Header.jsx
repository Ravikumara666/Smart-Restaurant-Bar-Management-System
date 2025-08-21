import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import React from "react";
import NotificationWrapper from "./NotificationWrapper"; // ✅ Import Wrapper

export default function Header() {
  const dispatch = useDispatch();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white sticky top-0 z-10">
      <div className="font-semibold">Smart Restaurant Admin</div>
      <div className="flex items-center gap-4">
        {/* ✅ Notification Bell with real-time updates */}
        <NotificationWrapper />

        {/* ✅ Logout Button */}
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
