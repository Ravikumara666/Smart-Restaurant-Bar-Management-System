// admin/components/NotificationBell.jsx
import { Bell } from "lucide-react";
import React from "react";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button onClick={onClick} className="relative p-2 rounded-xl hover:bg-gray-100">
      <Bell />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5 bg-red-500 text-white">
          {count}
        </span>
      )}
    </button>
  );
}