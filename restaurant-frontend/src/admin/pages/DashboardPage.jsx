// admin/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../utils/axiosInstance";
import StatsCard from "../components/StatsCard";
import { ShoppingBag, CreditCard, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const s1 = await adminApi.get("/dashboard/summary");
      const s2 = await adminApi.get("/dashboard/stats");
      setSummary(s1.data);
      setStats(s2.data);
    })();
  }, []);

  if (!summary || !stats) return <div className="p-6">Loading…</div>;

  const paymentChart = summary.paymentStats?.map(p => ({ name: p._id, value: p.count })) || [];
  const topItems = summary.mostOrderedItems?.map(x => ({ name: x.name, qty: x.totalQuantity })) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatsCard title="Total Orders" value={summary.totalOrders} icon={ShoppingBag} />
        <StatsCard title="Today's Orders" value={summary.todaysOrders} icon={TrendingUp} />
        <StatsCard title="Total Revenue" value={`₹${summary.totalRevenue || 0}`} icon={CreditCard} />
        <StatsCard title="Occupied Tables" value={summary.occupiedTables} hint={`of ${summary.totalTables}`} icon={Users} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-semibold mb-2">Payment Methods</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={paymentChart} dataKey="value" nameKey="name" outerRadius={80} label />
                {paymentChart.map((_, i) => (
                  <Cell key={i} />
                ))}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="font-semibold mb-2">Top Items</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topItems}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}