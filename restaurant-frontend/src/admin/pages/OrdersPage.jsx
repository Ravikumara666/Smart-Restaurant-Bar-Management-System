import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentOrders,
  fetchAllOrders,
} from "../features/orders/ordersThunks";
import OrderCard from "../components/OrderCard";
import OrderTable from "../components/OrderTable";
import socket from "../utils/socket";

const tabs = ["New", "Current", "History"];

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { recent = [], all = [], loading = false } = useSelector(
    (s) => s.orders || {}
  );

  const [tab, setTab] = useState("New");
  const [historyFilter, setHistoryFilter] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch orders initially
  useEffect(() => {
    dispatch(fetchRecentOrders());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // ✅ Listen for new order event via socket
// ✅ Single socket listener setup
useEffect(() => {
  socket.on("orderCreated", (order) => {
    console.log("📢 New order received:", order);
    setTab("New");
    dispatch(fetchRecentOrders());
    dispatch(fetchAllOrders());
  });

  socket.on("orderUpdated", (update) => {
    console.log("📢 Order updated:", update);
    setTab("Current");
    dispatch(fetchRecentOrders());
    dispatch(fetchAllOrders());
  });

  return () => {
    socket.off("orderCreated");
    socket.off("orderUpdated");
  };
}, [dispatch]);


  const filtered = useMemo(() => {
    const normalize = (s) => (s || "").toLowerCase();
    let result = [];

    if (tab === "New") {
      result = recent.filter((o) => normalize(o.status) === "pending");
    } else if (tab === "Current") {
      result = all.filter((o) =>
        ["preparing", "ready", "served", "completed"].includes(normalize(o.status)) && normalize(o.paymentStatus) === "pending"
      );
    } else {
      result = all.filter((o) =>
        ["completed", "cancelled"].includes(normalize(o.status)) && normalize(o.paymentStatus) === "paid"
      );

      // ✅ Apply history filters
      if (historyFilter === "today") {
        const today = new Date().toDateString();
        result = result.filter(
          (o) => new Date(o.updatedAt).toDateString() === today
        );
      } else if (historyFilter === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yDay = yesterday.toDateString();
        result = result.filter(
          (o) => new Date(o.updatedAt).toDateString() === yDay
        );
      } else if (historyFilter === "custom" && customDate) {
        result = result.filter(
          (o) =>
            new Date(o.updatedAt).toDateString() ===
            new Date(customDate).toDateString()
        );
      }
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = normalize(searchTerm);
      result = result.filter((o) => {
        const customerName = normalize(o.customerName);
        const tableNumber = o.tableId && o.tableId.tableNumber ? normalize(String(o.tableId.tableNumber)) : "";
        const totalPrice = normalize(String(o.totalPrice));
        const placedBy = normalize(o.placedBy);
        return (
          customerName.includes(term) ||
          tableNumber.includes(term) ||
          totalPrice.includes(term) ||
          placedBy.includes(term)
        );
      });
    }

    return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [tab, recent, all, historyFilter, customDate, searchTerm]);

  // ✅ Corrected listener in OrdersPage.jsx
useEffect(() => {
  socket.on("newOrder", (order) => {

    dispatch(fetchRecentOrders());
    dispatch(fetchAllOrders());
  });

  return () => {
    socket.off("newOrder"); // ✅ Clean up
  };
}, [dispatch]);

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-xl border transition ${
              tab === t ? "bg-gray-900 text-white" : "bg-white"
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* ✅ History Filter Buttons */}
      {tab === "History" && (
        <div className="flex items-center gap-2 mt-4">
          <button
            className={`px-3 py-1 rounded ${
              historyFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setHistoryFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${
              historyFilter === "today"
                ? "bg-gray-900 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setHistoryFilter("today")}
          >
            Today
          </button>
          <button
            className={`px-3 py-1 rounded ${
              historyFilter === "yesterday"
                ? "bg-gray-900 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setHistoryFilter("yesterday")}
          >
            Yesterday
          </button>
          <input
            type="date"
            className="px-3 py-1 border rounded"
            onChange={(e) => {
              setCustomDate(e.target.value);
              setHistoryFilter("custom");
            }}
          />
        </div>
      )}

      {/* Orders Section */}
      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : (
        <>
          {/* Order Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filtered.length > 0 ? (
              filtered.map((o) => <OrderCard key={o._id} order={o} />)
            ) : (
              <div className="text-gray-500 col-span-full text-center">
                No orders found
              </div>
            )}
          </div>

          {/* Order Table */}
          {filtered.length > 0 && (
            <div className="mt-6">
              <OrderTable orders={filtered} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
