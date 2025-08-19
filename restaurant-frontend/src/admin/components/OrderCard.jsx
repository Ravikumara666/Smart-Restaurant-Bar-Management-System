// admin/components/OrderCard.jsx
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useDispatch } from "react-redux";

import { updateOrderStatusThunk, fetchOrderBill } from "../features/orders/ordersThunks";
import React from "react";

export default function OrderCard({ order }) {
  const dispatch = useDispatch();
  const { _id, tableName, items = [], totalPrice, status } = order;

  const accept = () => dispatch(updateOrderStatusThunk({ id: _id, status: "Preparing" }));
  const reject = () => dispatch(updateOrderStatusThunk({ id: _id, status: "Cancelled" }));
  const ready  = () => dispatch(updateOrderStatusThunk({ id: _id, status: "Ready" }));
  const served = () => {
    dispatch(updateOrderStatusThunk({ id: _id, status: "Served" }))
      .then(() => dispatch(fetchOrderBill(_id)));
  };

  return (
    <div className="border rounded-2xl p-4 bg-white">
      <div className="flex justify-between items-center">
        <div className="font-semibold">Table: {tableName || order.table?.tableNumber}</div>
        <div className="text-sm px-2 py-1 rounded-lg bg-gray-100">{status}</div>
      </div>
      <ul className="text-sm text-gray-600 mt-2 space-y-1">
        {items.map((it) => (
          <li key={it._id}>{it.quantity} × {it.menuItem?.name || it.name}</li>
        ))}
      </ul>
      <div className="flex items-center justify-between mt-3">
        <div className="font-semibold">₹{totalPrice}</div>
        <div className="flex gap-2">
          <button onClick={accept} className="px-3 py-1 rounded-lg bg-blue-600 text-white">
            <Clock size={16} className="inline mr-1" /> Accept
          </button>
          <button onClick={ready} className="px-3 py-1 rounded-lg bg-amber-500 text-white">
            Ready
          </button>
          <button onClick={served} className="px-3 py-1 rounded-lg bg-green-600 text-white">
            <CheckCircle size={16} className="inline mr-1" /> Served
          </button>
          <button onClick={reject} className="px-3 py-1 rounded-lg bg-red-600 text-white">
            <XCircle size={16} className="inline mr-1" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}