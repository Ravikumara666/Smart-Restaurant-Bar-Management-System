import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";

const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL;

export default function OnlinePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ADMIN_BASE_URL}/orders`);
      const data = await res.json();

      // ✅ Filter only UPI payments
      const upiPayments = (data || []).filter(
        (order) => order.paymentMethod === "upi"
      );

      setPayments(upiPayments);
    } catch (err) {
      console.error("❌ Failed to fetch payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Helper function to format date to YYYY-MM-DD for comparison
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  const filteredPayments = payments.filter((p) => {
    // Filter by date
    const paymentDateStr = formatDate(p.createdAt || p.date || new Date());
    if (filter === "Today" && paymentDateStr !== todayStr) {
      return false;
    }
    if (filter === "Yesterday" && paymentDateStr !== yesterdayStr) {
      return false;
    }
    // Filter by search query
    if (search.trim() === "") return true;
    const lowerSearch = search.toLowerCase();
    const tableNumber = p.tableId?.tableNumber?.toString() || "";
    const customer = p.placedBy?.toString() || "";
    const totalPrice = p.totalPrice?.toString() || "";
    return (
      tableNumber.toLowerCase().includes(lowerSearch) ||
      customer.toLowerCase().includes(lowerSearch) ||
      totalPrice.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="p-6 space-y-4">
      <h2 className="font-semibold text-xl mb-4">💳 Online Payments (UPI)</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex gap-2">
          {["Today", "Yesterday", "All"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-semibold ${
                filter === f
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by customer, table, or amount"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading payments...</p>
      ) : filteredPayments.length === 0 ? (
        <p className="text-gray-500">No UPI payments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPayments.map((p) => (
            <div
              key={p._id}
              className="border rounded-2xl p-4 bg-white relative shadow"
            >
              {/* ✅ Paid Banner */}
              {p.paymentStatus === "Paid" && (
                <div className="absolute left-0 top-0 w-full rounded-t-2xl bg-green-600 text-white text-sm font-semibold px-4 py-2">
                  Payment Paid - {p.paymentMethod?.toUpperCase()}
                </div>
              )}

              <div className="mt-6">
                <div className="font-semibold">
                  Table: {p.tableId?.tableNumber || "Takeaway"}
                  <br />
                  Customer: {p.placedBy || "N/A"}
                  <br />
                  Status: {p.status}
                  <br />
                  Payment: {p.paymentStatus} ({p.paymentMethod})
                </div>

                <div className="font-semibold mt-3">₹{p.totalPrice}</div>

                <div className="mt-3">
                  <button
                    onClick={() =>
                      window.open(`${ADMIN_BASE_URL}/orders/${p._id}/bill`, "_blank")
                    }
                    className="px-3 py-1 rounded-lg bg-gray-800 text-white flex items-center gap-1"
                  >
                    <FileText size={16} /> View Bill
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}