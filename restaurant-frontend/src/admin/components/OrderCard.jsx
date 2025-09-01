import { CheckCircle, XCircle, Clock, FileText,Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { updateOrderStatusThunk, fetchOrderBill, markOrderCompleteThunk } from "../features/orders/ordersThunks";
import socket from "../utils/socket";

const ADMIN_BASE_URL= import.meta.env.VITE_ADMIN_BASE_URL

export default function OrderCard({ order }) {
  const dispatch = useDispatch();
  const { _id, tableName, items = [], additionalItems = [], totalPrice, status } = order;
  
  const [localStatus, setLocalStatus] = useState(status);
  const [localItems, setLocalItems] = useState(items); // Original items
  const [localAdditionalItems, setLocalAdditionalItems] = useState(additionalItems); // ✅ Track additional items
  const [bill, setBill] = useState(null);
  const [message, setMessage] = useState(null);
  const [hasNewItems, setHasNewItems] = useState(additionalItems.length > 0); // ✅ Show banner if items exist

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // ✅ Listen for order updates via socket
  useEffect(() => {
    socket.on("orderUpdated", (data) => {
      if (data.orderId === _id && data.addedItemsCount > 0) {
        console.log("📦 Order updated for this card:", data);

        const itemDetails = (data.newAdditionalItems || [])
          .map(i => `${i.quantity}×${i.name}`)
          .join(", ");
        showMessage(`➕ ${data.tableName}: ${itemDetails} added!`);

        // ✅ Update local additional items
        setLocalAdditionalItems(prev => [
          ...prev,
          ...data.newAdditionalItems.map(i => ({
            _id: Date.now() + Math.random(),
            name: i.name,
            quantity: i.quantity
          }))
        ]);

        setHasNewItems(true); // ✅ Show "New Items!" banner
      }
    });

    return () => {
      socket.off("orderUpdated");
    };
  }, [_id]);

  const accept = () => {
    setLocalStatus("preparing");
    dispatch(updateOrderStatusThunk({ id: _id, status: "preparing" }));
    showMessage("✅ Order Accepted");
  };

  const ready = () => {
    setLocalStatus("ready");
    dispatch(updateOrderStatusThunk({ id: _id, status: "ready" }));
    showMessage("🍽️ Order is Ready");
  };

  const served = () => {
    setLocalStatus("served");
    dispatch(updateOrderStatusThunk({ id: _id, status: "served" }));
    showMessage("✔️ Order Served Successfully");
  };

  const reject = () => {
    setLocalStatus("cancelled");
    dispatch(updateOrderStatusThunk({ id: _id, status: "cancelled" }));
    showMessage("❌ Order Cancelled");
  };

  const complete = () => {
    setLocalStatus("completed");
    dispatch(updateOrderStatusThunk({ id: _id, status: "completed" }));
    dispatch(markOrderCompleteThunk(_id));
    console.log("markde order completed")
    showMessage("✅ Order completed");
  };

  const generateBill = async () => {
    const result = await dispatch(fetchOrderBill(_id)).unwrap();
    setBill(result);
  };

  const getNextButton = () => {
    if (localStatus.toLowerCase() === "pending") {
      return (
        <>
          <button onClick={accept} className="px-3 py-1 rounded-lg bg-blue-600 text-white">
            <Clock size={16} className="inline mr-1" /> Accept
          </button>
          <button onClick={reject} className="px-3 py-1 rounded-lg bg-red-600 text-white">
            <XCircle size={16} className="inline mr-1" /> Reject
          </button>
        </>
      );
    } else if (localStatus === "preparing") {
      return (
        <button onClick={ready} className="px-3 py-1 rounded-lg bg-amber-500 text-white">
          Ready
        </button>
      );
    } else if (localStatus === "ready") {
      return (
        <button onClick={served} className="px-3 py-1 rounded-lg bg-green-600 text-white">
          <CheckCircle size={16} className="inline mr-1" /> Served
        </button>
      );
    } else if (localStatus === "served") {
      return (
        <button onClick={complete} className="px-3 py-1 rounded-lg bg-purple-600 text-white">
          ✅ Mark as Complete
        </button>
      );
    }
    return null;
  };
          // Delete order function
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${_id}`, { method: "DELETE" });
        if (res.ok) {
          showMessage("✅ Order deleted");
          // Optionally, reload or remove card. For now, reload:
          setTimeout(() => window.location.reload(), 100);
        } else {
          showMessage("❌ Failed to delete order");
        }
      } catch (err) {
        showMessage("❌ Error deleting order");
      }
    }
  };

  return (
    <div className="border rounded-2xl p-4 bg-white relative">
      {/* ✅ Banner for new items */}
      {hasNewItems && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          New Items!
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="font-semibold">
          Table: {tableName || order.tableId?.tableNumber}
          <br />
          Customer : {order?.placedBy}
        </div>
              <div className="flex items-center">
          <div className="text-sm px-2 py-1 rounded-lg bg-gray-100">{localStatus}</div>
          <button onClick={handleDelete} className="text-red-600 hover:text-red-800 ml-2">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* ✅ Original Items Section */}
      <div className="mt-3">
        <h4 className="font-semibold text-gray-700">Original Items</h4>
        <ul className="text-sm text-gray-600 mt-1 space-y-1">
          {localItems.map((i) => (
            <li key={i._id}>
              {i.quantity} × {i.menuItemId?.name || i.name}
            </li>
          ))}
        </ul>
      </div>


      {/* ✅ Additional Items Section */}
      {localAdditionalItems.length > 0 && (
        <div className="mt-3 border-t pt-2">
          <h4 className="font-semibold text-gray-700">Additional Items</h4>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            {localAdditionalItems.map((i) => (
              <li key={i._id}>
                {i.quantity} × {i.menuItemId?.name || i.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="font-semibold mt-3">Instructions: {order?.notes}</div>

      <div className="flex items-center justify-between mt-3">
        <div className="font-semibold">₹{totalPrice}</div>
        <div className="flex gap-2">{getNextButton()}</div>
      </div>

      {localStatus === "completed" && (
        <div className="mt-3">
          <button
            onClick={generateBill}
            className="px-3 py-1 rounded-lg bg-gray-800 text-white flex items-center gap-1"
          >
            <FileText size={16} /> Generate Bill
          </button>
        </div>
      )}

      {/* ✅ Popup Messages */}
      {message && (
        <div className="absolute top-2 right-2 bg-black text-white text-xs px-3 py-1 rounded-lg shadow-lg">
          {message}
        </div>
      )}

      {/* ✅ Bill Modal (unchanged) */}
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
              <h4 className="text-center font-semibold mb-2">Table: {bill.table}</h4>
              <div>
                <h5 className="font-bold mt-2">Food Items</h5>
                <ul>
                  {bill.items.filter(item => item.category !== "drinks").map((i, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{i.quantity} × {i.name}</span>
                      <span>₹{i.subtotal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-bold mt-2">Drink Items</h5>
                <ul>
                  {bill.items.filter(item => item.category === "drinks").map((i, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{i.quantity} × {i.name}</span>
                      <span>₹{i.subtotal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 border-t pt-2">
                <div className="flex justify-between"><span>Food Subtotal:</span><span>₹{bill.totals.foodSubtotal}</span></div>
                <div className="flex justify-between"><span>Drink Subtotal:</span><span>₹{bill.totals.drinkSubtotal}</span></div>
                <div className="flex justify-between"><span>CGST (2.5%):</span><span>₹{bill.totals.cgst}</span></div>
                <div className="flex justify-between"><span>SGST (2.5%):</span><span>₹{bill.totals.sgst}</span></div>
                <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Grand Total:</span><span>₹{bill.totals.grandTotal}</span></div>
              </div>
            </div>

            {/* Download + Print */}
            <div className="mt-6 flex justify-between gap-3">
              <a
                className="flex-1 px-4 py-2 rounded-xl bg-gray-900 text-white text-center"
                href={`${ADMIN_BASE_URL}/orders/${bill.orderId}/bill`}
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

    </div>
  );
}