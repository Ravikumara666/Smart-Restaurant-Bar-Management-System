import React, { useEffect, useState } from "react";
import { adminApi } from "../utils/axiosInstance";
import StatsCard from "../components/StatsCard";
import { 
  ShoppingBag, 
  CreditCard, 
  Users, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  Download
} from "lucide-react";
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
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        console.log(s1.data);
        console.log(s2.data);
        setTopItems(
          t.data.map((item) => ({
            name: item.name,
            qty: item.totalQuantity,
          }))
        );
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  if (!summary || !stats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const paymentChart =
    stats.paymentStats?.map((p) => ({ name: p._id, value: p.count })) || [];

  const orderStatusChart =
    stats.orderStatusStats?.map((p) => ({ name: p._id, value: p.count })) || [];

  // Simple, professional colors
  const COLORS = ["#2563eb", "#059669", "#dc2626", "#d97706", "#7c3aed"];

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      {/* Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-sm">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Simple Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="text-gray-700 font-medium py-2">View:</span>
        {["today", "week", "month", "year"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f === "today" ? "Today" : 
             f === "week" ? "This Week" : 
             f === "month" ? "This Month" : "This Year"}
          </button>
        ))}
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ShoppingBag size={20} className="text-blue-600" />
            </div>
            <h3 className="text-gray-600 font-medium">Total Orders</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{summary.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <h3 className="text-gray-600 font-medium">Total Revenue</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">₹{summary.totalRevenue || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Users size={20} className="text-orange-600" />
            </div>
            <h3 className="text-gray-600 font-medium">Tables Occupied</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {summary.occupiedTables}
            <span className="text-lg text-gray-500 ml-1">/ {summary.totalTables}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <h3 className="text-gray-600 font-medium">Average Order</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            ₹{Math.round((summary.totalRevenue || 0) / (summary.totalOrders || 1))}
          </p>
        </div>
      </div>

      {/* Simple Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Payment Methods - Simple */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="h-64">
            {paymentChart.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie 
                      data={paymentChart} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={70}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {paymentChart.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {paymentChart.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></span>
                      <span className="text-gray-700">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No payment data available
              </div>
            )}
          </div>
        </div>

        {/* Order Status - Simple */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="h-64">
            {orderStatusChart.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={orderStatusChart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {orderStatusChart.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {orderStatusChart.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></span>
                      <span className="text-gray-700">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No order data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue and Top Items */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend - Simple */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64">
            {revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue}>
                  <XAxis 
                    dataKey="_id" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalRevenue" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        {/* Top Items - Simple */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Menu Items</h3>
          <div className="h-64">
            {topItems.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItems}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Orders']}
                  />
                  <Bar 
                    dataKey="qty" 
                    fill="#2563eb"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No menu data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}