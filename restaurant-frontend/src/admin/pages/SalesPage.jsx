// admin/pages/SalesPage.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../utils/axiosInstance";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await adminApi.get("/sales");
      setSales(data || []);
    })();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-2xl border bg-white p-4">
        <div className="font-semibold mb-2">Sales</div>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={sales}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="total" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4">
          <a
            className="px-4 py-2 rounded-xl bg-gray-900 text-white"
            href={`${import.meta.env.VITE_ADMIN_BASE_URL}/sales/export`}
          >
            Export CSV
          </a>
        </div>
      </div>
    </div>
  );
}