import React from "react";

// admin/components/StatsCard.jsx

export default function StatsCard({ title, value, hint, icon }) {
  const Icon = icon;
  return (
    <div className="rounded-2xl border p-5 bg-white flex items-center justify-between">
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
        {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
      </div>
      {Icon && (
        <div className="p-3 rounded-xl bg-gray-100">
          <Icon />
        </div>
      )}
    </div>
  );
}