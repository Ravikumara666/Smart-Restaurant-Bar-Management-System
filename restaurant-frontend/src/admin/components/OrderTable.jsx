import React from "react";

// admin/components/OrderTable.jsx

export default function OrderTable({ orders = [] }) {
  return (
    <div className="overflow-auto border rounded-2xl bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3">Order #</th>
            <th className="text-left p-3">customerName</th>
            <th className="text-left p-3">Table</th>
            <th className="text-left p-3">Items</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Total</th>
            <th className="text-left p-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-3">{o._id.slice(-6)}</td>
              <td className="p-3">{o.placedBy || o.placedBy}</td>
              <td className="p-3">{o.tableId.tableNumber || o.table?.tableNumber}</td>
              <td className="p-3">
                {o.items
  ?.map((i) => `${i.quantity}x ${i.menuItemId?.name || i.name}`)
  .join(", ")}
              </td>
              <td className="p-3">{o.status}</td>
              <td className="p-3">₹{o.totalPrice}</td>
              <td className="p-3">{new Date(o.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}