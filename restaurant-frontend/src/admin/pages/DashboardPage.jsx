import React, { useEffect, useState } from "react";
import { adminApi } from "../utils/axiosInstance";
import StatsCard from "../components/StatsCard";
import { ShoppingBag, CreditCard, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [filter, setFilter] = useState("today"); // ✅ Default filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s1, s2, r, t] = await Promise.all([
          adminApi.get(`/dashboard/summary?range=${filter}`),
          adminApi.get(`/dashboard/stats?range=${filter}`),
          adminApi.get(`/dashboard/revenue?range=${filter}`),
          adminApi.get(`/dashboard/top-items?range=${filter}`),
        ]);
        setSummary(s1.data);
        setStats(s2.data);
        setRevenue(r.data);
        setTopItems(
  t.data.map((item) => ({
    name: item.name,
    qty: item.totalQuantity,
  }))
);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [filter]);

  if (!summary || !stats) return <div className="p-6">Loading…</div>;

  const paymentChart =
    stats.paymentStats?.map((p) => ({ name: p._id, value: p.count })) || [];

  const orderStatusChart =
    stats.orderStatusStats?.map((p) => ({ name: p._id, value: p.count })) || [];

  const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28", "#AF19FF"];
  
  return (
    <div className="p-6 space-y-6">
      {/* ✅ Filter Buttons */}
      <div className="flex items-center gap-3 mb-6">
        {["today", "week", "month", "year"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg border capitalize ${
              filter === f ? "bg-gray-900 text-white" : "bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatsCard title="Total Orders" value={summary.totalOrders} icon={ShoppingBag} />
        <StatsCard
          title="Total Revenue"
          value={`₹${summary.totalRevenue || 0}`}
          icon={CreditCard}
        />
<StatsCard
  title="Occupied Tables"
  value={summary.occupiedTables}
  hint={`of ${summary.totalTables}`}
  icon={Users}
/>

      </div>

      {/* ✅ Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ✅ Payment Pie Chart */}
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-semibold mb-2">Payment Methods</div>
          <div className="h-64 flex flex-col items-center justify-center">
            {paymentChart.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie data={paymentChart} dataKey="value" nameKey="name" outerRadius={80} label>
                      {paymentChart.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex gap-4 flex-wrap justify-center">
                  {paymentChart.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></span>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">No payment data available</p>
            )}
          </div>
        </div>

        {/* ✅ Order Status Pie Chart */}
        <div className="rounded-2xl border bg-white p-4">
  <div className="font-semibold mb-2">Order Status</div>
  <div className="h-64 flex flex-col items-center justify-center">
    {orderStatusChart.length > 0 ? (
      <>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={orderStatusChart}
              dataKey="value"
              nameKey="name"
              outerRadius={90} // Increased for better visibility
              label={({ name, value }) => `${value}`} // ✅ Show only numbers
              labelLine={false} // ✅ Remove lines for cleaner look
            >
              {orderStatusChart.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* ✅ Legend */}
        <div className="mt-4 flex gap-4 flex-wrap justify-center">
          {orderStatusChart.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              ></span>
              <span className="text-sm text-gray-700">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p className="text-gray-500">No order status data available</p>
    )}
  </div>
</div>
      </div>

      {/* ✅ Revenue Trend & Top Items */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ✅ Revenue Trend Line Chart */}
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-semibold mb-2">Revenue Trend</div>
          <div className="h-64">
            {revenue.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={revenue}>
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No revenue data available</p>
            )}
          </div>
        </div>

        {/* ✅ Top Items Bar Chart */}
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-semibold mb-2">Top Items</div>
          <div className="h-64">
            {topItems.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={topItems}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="qty" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No top items data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
