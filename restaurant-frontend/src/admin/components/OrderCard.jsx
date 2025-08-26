import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { updateOrderStatusThunk, fetchOrderBill } from "../features/orders/ordersThunks";

export default function OrderCard({ order }) {
  const dispatch = useDispatch();
  const { _id, tableName, items = [], totalPrice, status } = order;

  // Local UI state
  const [localStatus, setLocalStatus] = useState(status);
  const [bill, setBill] = useState(null); // ⬅️ bill data for this card
  const [message, setMessage] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const accept = () => {
    setLocalStatus("Preparing");
    dispatch(updateOrderStatusThunk({ id: _id, status: "Preparing" }));
    showMessage("✅ Order Accepted");
  };

  const ready = () => {
    setLocalStatus("Ready");
    dispatch(updateOrderStatusThunk({ id: _id, status: "Ready" }));
    showMessage("🍽️ Order is Ready");
  };

  const served = () => {
    setLocalStatus("Served");
    dispatch(updateOrderStatusThunk({ id: _id, status: "Served" }));
    showMessage("✔️ Order Served Successfully");
  };

  const reject = () => {
    setLocalStatus("Cancelled");
    dispatch(updateOrderStatusThunk({ id: _id, status: "Cancelled" }));
    showMessage("❌ Order Cancelled");
  };

  // Fetch bill on demand
  const generateBill = async () => {
    const result = await dispatch(fetchOrderBill(_id)).unwrap();
    setBill(result); // { order, totals }
  };

const getNextButton = () => {
  if (localStatus.toLowerCase() === "pending") {
    return (
      <>
        <button
          onClick={accept}
          className="px-3 py-1 rounded-lg bg-blue-600 text-white"
        >
          <Clock size={16} className="inline mr-1" /> Accept
        </button>
        <button
          onClick={reject}
          className="px-3 py-1 rounded-lg bg-red-600 text-white"
        >
          <XCircle size={16} className="inline mr-1" /> Reject
        </button>
      </>
    );
  } else if (localStatus === "Preparing") {
    return (
      <button
        onClick={ready}
        className="px-3 py-1 rounded-lg bg-amber-500 text-white"
      >
        Ready
      </button>
    );
  } else if (localStatus === "Ready") {
    return (
      <button
        onClick={served}
        className="px-3 py-1 rounded-lg bg-green-600 text-white"
      >
        <CheckCircle size={16} className="inline mr-1" /> Served
      </button>
    );
  }
  return null;
};

console.log(bill)
  return (
    <div className="border rounded-2xl p-4 bg-white relative">
      <div className="flex justify-between items-center">
        <div className="font-semibold">
          Table: {tableName || order.tableId?.tableNumber}
          <br></br>
          Customer : {order?.placedBy}
        </div>
        <div className="text-sm px-2 py-1 rounded-lg bg-gray-100">{localStatus}</div>
      </div>

      <ul className="text-sm text-gray-600 mt-2 space-y-1">
        {items.map((i) => (
          <li key={i._id}>
            {i.quantity} × {i.menuItemId?.name || i.name}
          </li>
        ))}
      </ul>
      <div className="font-semibold">
          Instructions : {order?.notes}
        </div>

      <div className="flex items-center justify-between mt-3">
        <div className="font-semibold">₹{totalPrice}</div>
        <div className="flex gap-2">
          {getNextButton()}
          {localStatus === "Pending" && (
            <button onClick={reject} className="px-3 py-1 rounded-lg bg-red-600 text-white">
              <XCircle size={16} className="inline mr-1" /> Reject
            </button>
          )}
        </div>
      </div>

      {/* Generate Bill button only after Served */}
      {localStatus === "Served" && (
        <div className="mt-3">
          <button
            onClick={generateBill}
            className="px-3 py-1 rounded-lg bg-gray-800 text-white flex items-center gap-1"
          >
            <FileText size={16} /> Generate Bill
          </button>
        </div>
      )}

      {/* Bill Modal */}
      {bill && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setBill(null)} // close local bill modal
            >
              ✕
            </button>

            <div className="font-semibold text-lg text-center mb-4">Restaurant Bill</div>
<div id="printable-bill" className="text-sm text-gray-800">
  <ul className="mb-2">
    {bill.items.map((i, idx) => (
      <li key={idx} className="flex justify-between">
        <span>
          {i.quantity} × {i.name}
        </span>
        <span>₹{i.subtotal}</span>
      </li>
    ))}
  </ul>
  <div className="flex justify-between">
    <span>Subtotal:</span>
    <span>₹{bill.totals?.subtotal}</span>
  </div>
  <div className="flex justify-between">
    <span>Tax (18% GST):</span>
    <span>₹{bill.totals?.tax}</span>
  </div>
  <div className="flex justify-between font-bold border-t mt-2 pt-2">
    <span>Grand Total:</span>
    <span>₹{bill.totals?.grandTotal}</span>
  </div>
</div>

            {/* Download + Print */}
            <div className="mt-6 flex justify-between gap-3">
              <a
                className="flex-1 px-4 py-2 rounded-xl bg-gray-900 text-white text-center"
                href={`${import.meta.env.VITE_ADMIN_BASE_URL}/orders/${bill.orderId}/bill`}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </a>
              <button
                onClick={() => {
                  const printContents = document.getElementById("printable-bill").innerHTML;
                  const printWindow = window.open("", "", "width=300,height=500");
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print Bill</title>
                        <style>
                          body { font-family: monospace; font-size: 12px; padding: 10px; }
                          .line { border-top: 1px dashed #000; margin: 6px 0; }
                          .center { text-align: center; font-weight: bold; margin-bottom: 10px; }
                          .flex { display: flex; justify-content: space-between; }
                        </style>
                      </head>
                      <body>
                        <div class="center">Restaurant Bill</div>
                        ${printContents}
                        <div class="line"></div>
                        <div class="center">Thank You! Visit Again 🙏</div>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small popup messages */}
      {message && (
        <div className="absolute top-2 right-2 bg-black text-white text-xs px-3 py-1 rounded-lg shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
}