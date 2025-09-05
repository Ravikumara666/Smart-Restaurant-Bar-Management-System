// import { CheckCircle, XCircle, Clock, FileText,Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { updateOrderStatusThunk, fetchOrderBill, markOrderCompleteThunk } from "../features/orders/ordersThunks";
import socket from "../utils/socket";
import { CheckCircle, XCircle, Clock, FileText, Trash2, Users, CreditCard, AlertCircle } from "lucide-react";
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
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // ✅ Listen for order updates via socket
  useEffect(() => {
    socket.on("orderUpdated", (data) => {
      if (data.orderId === _id && data.addedItemsCount > 0) {

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
    showMessage("✅ Order completed");
  };

  const generateBill = async () => {
    const result = await dispatch(fetchOrderBill(_id)).unwrap();
    setBill(result);
  };

  const handleMarkAsPaid = async () => {
    if (!window.confirm("Are you sure you want to mark this order as Paid?")) return;
    try {
      setLoadingPayment(true);
      const response = await fetch(`${ADMIN_BASE_URL}/orders/${_id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Paid" })
      });
      if (response.ok) {
        // Update local order paymentStatus
        order.paymentStatus = "Paid";
        showMessage("✅ Payment marked as Paid");
      } else {
        showMessage("❌ Failed to mark as Paid");
      }
    } catch (err) {
      console.error("❌ Failed to mark payment:", err);
      showMessage("❌ Failed to mark as Paid");
    } finally {
      setLoadingPayment(false);
    }
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
        const res = await fetch(`${ADMIN_BASE_URL}/orders/${_id}`, { method: "DELETE" });
        if (res.ok) {
          showMessage("✅ Order deleted");
          setIsDeleted(true);
        } else {
          showMessage("❌ Failed to delete order");
        }
      } catch (err) {
        showMessage("❌ Error deleting order");
      }
    }
  };

  if (isDeleted) return null;

    const getStatusColor = () => {
    switch (localStatus.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'served': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return(
  <div className={`relative bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow ${order.paymentStatus === "Paid" ? "border-green-400 bg-green-50" : "border-gray-200"}`}>
      
      {/* Payment Status Banner */}
      {order.paymentStatus === "Paid" && (
        <div className="absolute -top-2 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <CreditCard size={12} />
          PAID {order.paymentMethod && `• ${order.paymentMethod}`}
        </div>
      )}

      {/* New Items Alert */}
      {hasNewItems && localStatus!="completed"&& (
        <div className="absolute -top-2 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
          NEW ITEMS!
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              {/* {tableName?.split('-')[1] || tableName?.[tableName.length - 1] || 'T'} */}
              {tableName || order.tableId?.tableNumber}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{tableName}</h3>
              <p className="text-sm text-gray-600">{order?.placedBy}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor()}`}>
              {localStatus.toUpperCase()}
            </span>
            <button 
              onClick={handleDelete} 
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <CreditCard size={14} className="text-gray-500" />
          <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-700' : 'text-orange-700'}`}>
            {order.paymentStatus || "Pending"}
          </span>
          {order.paymentMethod && (
            <span className="text-gray-500">• {order.paymentMethod}</span>
          )}
        </div>

        {/* Items */}
        <div className="space-y-2 mb-3">
          {/* Original Items */}
          <div>
            <ul className="text-sm space-y-1">
              {localItems.map((item) => (
                <li key={item._id} className="flex justify-between text-gray-700">
                  <span>{item.quantity}× {item.menuItemId?.name || item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Items */}
          {localAdditionalItems.length > 0 && (
            <div className="border-t pt-2">
              <div className="flex items-center gap-1 mb-1">
                <AlertCircle size={12} className="text-orange-500" />
                <span className="text-xs font-semibold text-orange-700 uppercase">Additional</span>
              </div>
              <ul className="text-sm space-y-1">
                {localAdditionalItems.map((item) => (
                  <li key={item._id} className="flex justify-between text-orange-700">
                    <span>{item.quantity}× {item.menuItemId?.name || item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Special Instructions */}
        {order?.notes!="" && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">SPECIAL INSTRUCTIONS</p>
            <p className="text-sm text-gray-800">{order.notes}</p>
          </div>
        )}

        {/* Total and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">₹{totalPrice}</div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 space-y-2">
          {getNextButton()}
          
          {localStatus === "completed" && (
            <div className="flex gap-2">
              <button
                onClick={generateBill}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <FileText size={14} />
                Generate Bill
              </button>
              {order.paymentStatus === "Pending" && (
                <button
                  onClick={handleMarkAsPaid}
                  className="flex-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                  disabled={loadingPayment}
                >
                  {loadingPayment ? "Processing..." : "Mark Paid"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg shadow-lg z-20">
          {message}
        </div>
      )}

      {/* Bill Modal */}
{bill && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        onClick={() => setBill(null)}
      >
        ✕
      </button>

      <div className="font-bold text-xl text-center mb-6 text-gray-800">Restaurant Bill</div>
      
      <div id="printable-bill" className="text-sm text-gray-800">
        {/* Header */}
        <div className="text-center mb-4 pb-3 border-b-2 border-dashed border-gray-300">
          <h4 className="font-bold text-lg">Table: {bill.table}</h4>
          <div className="text-xs text-gray-600 mt-1">
            Order ID: {bill.orderId}
          </div>
        </div>

        {/* Food Items Section */}
        {bill.items.filter(item => item.category !== "drinks").length > 0 && (
          <div className="mb-4">
            <h5 className="font-bold mb-3 text-gray-700 border-b border-gray-200 pb-1">
              FOOD ITEMS
            </h5>
            <div className="space-y-2">
              {bill.items.filter(item => item.category !== "drinks").map((i, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div className="flex-1">
                    <span className="font-medium">{i.quantity} × {i.name}</span>
                  </div>
                  <div className="font-semibold text-right min-w-[60px]">
                    ₹{i.subtotal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drink Items Section - Only show if drinks exist */}
        {bill.items.filter(item => item.category === "drinks").length > 0 && (
          <div className="mb-4">
            <h5 className="font-bold mb-3 text-gray-700 border-b border-gray-200 pb-1">
              BEVERAGES
            </h5>
            <div className="space-y-2">
              {bill.items.filter(item => item.category === "drinks").map((i, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div className="flex-1">
                    <span className="font-medium">{i.quantity} × {i.name}</span>
                  </div>
                  <div className="font-semibold text-right min-w-[60px]">
                    ₹{i.subtotal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bill Summary */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4">
          <div className="space-y-2">
            {bill.totals.foodSubtotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Food Subtotal:</span>
                <span className="font-semibold min-w-[60px] text-right">₹{bill.totals.foodSubtotal}</span>
              </div>
            )}
            
            {bill.totals.drinkSubtotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Beverage Subtotal:</span>
                <span className="font-semibold min-w-[60px] text-right">₹{bill.totals.drinkSubtotal}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-600">CGST (2.5%):</span>
              <span className="font-semibold min-w-[60px] text-right">₹{bill.totals.cgst}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">SGST (2.5%):</span>
              <span className="font-semibold min-w-[60px] text-right">₹{bill.totals.sgst}</span>
            </div>
            
            <div className="border-t-2 border-gray-400 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">TOTAL AMOUNT:</span>
                <span className="font-bold text-lg min-w-[70px] text-right">₹{bill.totals.grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between gap-3">
        <a
          className="flex-1 px-4 py-3 rounded-xl bg-gray-900 text-white text-center font-semibold hover:bg-gray-800 transition-colors"
          href={`${ADMIN_BASE_URL}/orders/${bill.orderId}/bill`}
          target="_blank"
          rel="noreferrer"
        >
          Download PDF
        </a>
        <button
          onClick={() => {
            const printContents = document.getElementById("printable-bill").innerHTML;
            const printWindow = window.open("", "", "width=350,height=600");
            printWindow.document.write(`
              <html>
                <head>
                  <title>Restaurant Bill - Table ${bill.table}</title>
                  <style>
                    body { 
                      font-family: 'Courier New', monospace; 
                      font-size: 14px; 
                      padding: 20px; 
                      line-height: 1.4;
                      max-width: 300px;
                      margin: 0 auto;
                    }
                    .header {
                      text-align: center; 
                      font-weight: bold; 
                      font-size: 18px;
                      margin-bottom: 20px;
                      border-bottom: 2px dashed #000;
                      padding-bottom: 10px;
                    }
                    .section-title {
                      font-weight: bold;
                      border-bottom: 1px solid #000;
                      padding-bottom: 2px;
                      margin: 15px 0 8px 0;
                    }
                    .item-row {
                      display: flex;
                      justify-content: space-between;
                      padding: 3px 0;
                    }
                    .summary {
                      border-top: 2px dashed #000;
                      margin-top: 15px;
                      padding-top: 10px;
                    }
                    .total-row {
                      border-top: 2px solid #000;
                      margin-top: 8px;
                      padding-top: 8px;
                      font-weight: bold;
                      font-size: 16px;
                    }
                    .footer {
                      text-align: center;
                      margin-top: 20px;
                      border-top: 1px dashed #000;
                      padding-top: 10px;
                      font-style: italic;
                    }
                  </style>
                </head>
                <body>
                  <div class="header">RESTAURANT BILL</div>
                  ${printContents.replace(/class="/g, 'class="').replace(/₹/g, 'Rs. ')}
                  <div class="footer">Thank You for Visiting!<br/>Please Visit Again 🙏</div>
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
          }}
          className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Print Bill
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

//   return (
//     <div className={`border rounded-2xl p-4 bg-white relative ${order.paymentStatus === "Paid" ? "border-green-600 bg-green-50" : ""}`}>
//       {/* ✅ Payment Paid Banner */}
//       {order.paymentStatus === "Paid" && (
//         <div className="absolute left-0 top-0 w-full rounded-t-2xl bg-green-600 text-white text-sm font-semibold px-4 py-2 flex items-center z-10" style={{borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem'}}>
//           Payment Paid{order.paymentMethod ? ` - ${order.paymentMethod}` : ""}
//         </div>
//       )}
//       {/* ✅ Banner for new items */}
//       {hasNewItems && (
//         <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
//           New Items!
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <div className="font-semibold">
//           Table: {tableName || order.tableId?.tableNumber}
//           <br />
//           Customer : {order?.placedBy}
//           <br />
//           Payment: {order.paymentStatus || "Pending"}{order.paymentMethod ? ` (${order.paymentMethod})` : ""}
//         </div>
//               <div className="flex items-center">
//           <div className="text-sm px-2 py-1 rounded-lg bg-gray-100">{localStatus}</div>
//           <button onClick={handleDelete} className="text-red-600 hover:text-red-800 ml-2">
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>

//       {/* ✅ Original Items Section */}
//       <div className="mt-3">
//         <h4 className="font-semibold text-gray-700">Original Items</h4>
//         <ul className="text-sm text-gray-600 mt-1 space-y-1">
//           {localItems.map((i) => (
//             <li key={i._id}>
//               {i.quantity} × {i.menuItemId?.name || i.name}
//             </li>
//           ))}
//         </ul>
//       </div>


//       {/* ✅ Additional Items Section */}
//       {localAdditionalItems.length > 0 && (
//         <div className="mt-3 border-t pt-2">
//           <h4 className="font-semibold text-gray-700">Additional Items</h4>
//           <ul className="text-sm text-gray-600 mt-1 space-y-1">
//             {localAdditionalItems.map((i) => (
//               <li key={i._id}>
//                 {i.quantity} × {i.menuItemId?.name || i.name}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div className="font-semibold mt-3">Instructions: {order?.notes}</div>

//       <div className="flex items-center justify-between mt-3">
//         <div className="font-semibold">₹{totalPrice}</div>
//         <div className="flex gap-2">{getNextButton()}</div>
//       </div>

//       {localStatus === "completed" && (
//         <div className="mt-3">
//           <button
//             onClick={generateBill}
//             className="px-3 py-1 rounded-lg bg-gray-800 text-white flex items-center gap-1"
//           >
//             <FileText size={16} /> Generate Bill
//           </button>
//           {order.status === "completed" && order.paymentStatus === "Pending" && (
//             <button
//               onClick={handleMarkAsPaid}
//               className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//               disabled={loadingPayment}
//             >
//               {loadingPayment ? "Processing..." : "Mark as Paid"}
//             </button>
//           )}
//         </div>
//       )}

//       {/* ✅ Popup Messages */}
//       {message && (
//         <div className="absolute top-2 right-2 bg-black text-white text-xs px-3 py-1 rounded-lg shadow-lg">
//           {message}
//         </div>
//       )}

//       {/* ✅ Bill Modal (unchanged) */}
//       {bill && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//               onClick={() => setBill(null)} // close local bill modal
//             >
//               ✕
//             </button>

//             <div className="font-semibold text-lg text-center mb-4">Restaurant Bill</div>
//             <div id="printable-bill" className="text-sm text-gray-800">
//               <h4 className="text-center font-semibold mb-2">Table: {bill.table}</h4>
//               <div>
//                 <h5 className="font-bold mt-2">Food Items</h5>
//                 <ul>
//                   {bill.items.filter(item => item.category !== "drinks").map((i, idx) => (
//                     <li key={idx} className="flex justify-between">
//                       <span>{i.quantity} × {i.name}</span>
//                       <span>₹{i.subtotal}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h5 className="font-bold mt-2">Drink Items</h5>
//                 <ul>
//                   {bill.items.filter(item => item.category === "drinks").map((i, idx) => (
//                     <li key={idx} className="flex justify-between">
//                       <span>{i.quantity} × {i.name}</span>
//                       <span>₹{i.subtotal}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="mt-4 border-t pt-2">
//                 <div className="flex justify-between"><span>Food Subtotal:</span><span>₹{bill.totals.foodSubtotal}</span></div>
//                 <div className="flex justify-between"><span>Drink Subtotal:</span><span>₹{bill.totals.drinkSubtotal}</span></div>
//                 <div className="flex justify-between"><span>CGST (2.5%):</span><span>₹{bill.totals.cgst}</span></div>
//                 <div className="flex justify-between"><span>SGST (2.5%):</span><span>₹{bill.totals.sgst}</span></div>
//                 <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Grand Total:</span><span>₹{bill.totals.grandTotal}</span></div>
//               </div>
//             </div>

//             {/* Download + Print */}
//             <div className="mt-6 flex justify-between gap-3">
//               <a
//                 className="flex-1 px-4 py-2 rounded-xl bg-gray-900 text-white text-center"
//                 href={`${ADMIN_BASE_URL}/orders/${bill.orderId}/bill`}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 Download
//               </a>
//               <button
//                 onClick={() => {
//                   const printContents = document.getElementById("printable-bill").innerHTML;
//                   const printWindow = window.open("", "", "width=300,height=500");
//                   printWindow.document.write(`
//                     <html>
//                       <head>
//                         <title>Print Bill</title>
//                         <style>
//                           body { font-family: monospace; font-size: 12px; padding: 10px; }
//                           .line { border-top: 1px dashed #000; margin: 6px 0; }
//                           .center { text-align: center; font-weight: bold; margin-bottom: 10px; }
//                           .flex { display: flex; justify-content: space-between; }
//                         </style>
//                       </head>
//                       <body>
//                         <div class="center">Restaurant Bill</div>
//                         ${printContents}
//                         <div class="line"></div>
//                         <div class="center">Thank You! Visit Again 🙏</div>
//                       </body>
//                     </html>
//                   `);
//                   printWindow.document.close();
//                   printWindow.focus();
//                   printWindow.print();
//                   printWindow.close();
//                 }}
//                 className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white"
//               >
//                 Print
//               </button>
//             </div>


//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

