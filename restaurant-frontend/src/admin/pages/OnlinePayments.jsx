import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";

const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL;

export default function OnlinePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Today");
  const [search, setSearch] = useState("");
  const [bill, setBill] = useState(null); // ✅ Bill state
  const [billLoading, setBillLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ADMIN_BASE_URL}/orders`);
      const data = await res.json();
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

  const fetchBill = async (orderId) => {
    setBillLoading(true);
    try {
      const res = await fetch(`${ADMIN_BASE_URL}/orders/${orderId}/bill`);
      const data = await res.json();
      setBill(data);
    } catch (err) {
      console.error("❌ Failed to fetch bill:", err);
      setBill(null);
    } finally {
      setBillLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Filtering logic unchanged...
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };
  const todayStr = formatDate(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  const filteredPayments = payments.filter((p) => {
    const paymentDateStr = formatDate(p.createdAt || p.date || new Date());
    if (filter === "Today" && paymentDateStr !== todayStr) return false;
    if (filter === "Yesterday" && paymentDateStr !== yesterdayStr) return false;
    if (search.trim() === "") return true;
    const lowerSearch = search.toLowerCase();
    return (
      (p.tableId?.tableNumber || "").toLowerCase().includes(lowerSearch) ||
      (p.placedBy || "").toLowerCase().includes(lowerSearch) ||
      (p.totalPrice?.toString() || "").includes(lowerSearch)
    );
  });

  return (
    <div className="p-6 space-y-4">
      <h2 className="font-semibold text-xl mb-4">💳 Online Payments (UPI)</h2>

      {/* Filters + Search */}
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
              {/* Paid Banner */}
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
                    onClick={() => fetchBill(p._id)}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-white flex items-center gap-1"
                  >
                    <FileText size={16} /> {billLoading ? "Loading..." : "View Bill"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Bill Modal */}
      {bill && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setBill(null)}
            >
              ✕
            </button>
            <div className="font-bold text-xl text-center mb-6 text-gray-800">
              Restaurant Bill
            </div>

            {/* Food Items */}
            {bill.items.map((i, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{i.quantity}× {i.name}</span>
                <span>₹{i.subtotal}</span>
              </div>
            ))}

            {/* Totals */}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{bill.totals?.grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}