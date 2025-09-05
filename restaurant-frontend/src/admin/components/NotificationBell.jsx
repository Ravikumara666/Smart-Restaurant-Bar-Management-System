// admin/components/NotificationBell.jsx
import { Bell } from "lucide-react";
import React from "react";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
    >
      <Bell className="group-hover:scale-110 transition-transform duration-200" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse min-w-[18px] text-center font-semibold shadow-lg">
          {count}
        </span>
      )}
    </button>
  );
}