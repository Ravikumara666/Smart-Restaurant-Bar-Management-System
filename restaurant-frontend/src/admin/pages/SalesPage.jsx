import React, { useEffect, useState } from "react";
import { adminApi } from "../utils/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SalesPage() {
  const [salesData, setSalesData] = useState([]);
  const [range, setRange] = useState("1 Month");

  // ✅ Fetch sales data based on selected range
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await adminApi.get(`/sales?range=${encodeURIComponent(range)}`);
        setSalesData(data || []);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setSalesData([]);
      }
    };

    fetchSales();
  }, [range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  // ✅ Download CSV using the authenticated axios instance
  const handleExportCsv = async () => {
    try {
      const res = await adminApi.get("/sales/export", {
        responseType: "blob",
        headers: { Accept: "text/csv" },
      });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = url;
      link.setAttribute("download", `sales_report_${ts}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[Export CSV] Failed:", err);
      alert(err?.response?.data?.error || err?.message || "Failed to export CSV");
    }
  };

  // ✅ Format date for XAxis labels (dd/MM)
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">Sales Report</h2>
          <div className="flex items-center gap-4">
            <select
              value={range}
              onChange={handleRangeChange}
              className="border rounded-lg px-3 py-1 text-sm"
            >
              <option value="1 Week">1 Week</option>
              <option value="1 Month">1 Month</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
              <option value="5 Years">5 Years</option>
            </select>
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="h-80">
          {salesData.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No sales data available</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}