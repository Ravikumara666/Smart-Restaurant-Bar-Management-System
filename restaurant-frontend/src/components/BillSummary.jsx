// src/components/BillSummary.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentResult from "./PaymentResult";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function BillSummary({ orderId, onClose }) {
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Fetch bill from backend
  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/orders/${orderId}/bill`);
        setBill(data);
      } catch (err) {
        console.error("Failed to fetch bill:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchBill();
  }, [orderId]);

  const handlePayment = async () => {
    if (!bill) return;
    setPaymentProcessing(true);

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection and try again.");
      setPaymentProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/orders/razorpay/order`, { orderId });
      const { razorpayOrder, paymentId } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Restaurant Payment",
        description: `Payment for Order ID: ${orderId}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await axios.post(`${API_BASE_URL}/orders/razorpay/verify`, {
              orderId,
              paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            setPaymentResult({ status: "success", details: { orderId, transactionId: response.razorpay_payment_id, amount: bill.totals.grandTotal } });
          } catch (error) {
            console.error("Payment verification failed:", error);
            setPaymentResult({ status: "failure", details: { orderId } });
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          // Optionally add user info here if available
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response){
        alert("Payment failed: " + response.error.description);
        setPaymentProcessing(false);
      });
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      alert("Failed to initiate payment. Please try again.");
      setPaymentProcessing(false);
    }
  };

  if (paymentResult) {
    return(
<PaymentResult
  status={paymentResult.status}
  details={paymentResult.details}
  onClose={() => navigate(`/order-status/${details.orderId}`)}
/>)
  }

  if (loading) return <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 shadow-lg text-gray-700 font-semibold">Loading Bill...</div></div>;
  if (!bill) return <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 shadow-lg text-gray-700 font-semibold">No Bill Found</div></div>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close bill summary"
        >
          ✕
        </button>

        <div className="font-extrabold text-2xl text-center mb-8 text-gray-900 tracking-wide">Restaurant Bill</div>

        <div id="printable-bill" className="text-gray-800 flex-grow">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-gray-300">
            <h4 className="font-bold text-xl tracking-wide">Table: {bill.table}</h4>
            <div className="text-sm text-gray-600 mt-1">
              Order ID: <span className="font-mono">{bill.orderId}</span>
            </div>
          </div>

          {/* Food Items */}
          {bill.items.filter(i => i.category !== "drinks").length > 0 && (
            <div className="mb-6">
              <h5 className="font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2 tracking-wide">
                FOOD ITEMS
              </h5>
              <div className="space-y-3">
                {bill.items.filter(i => i.category !== "drinks").map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div className="flex-1 text-base font-medium">{i.quantity} × {i.name}</div>
                    <div className="font-semibold text-right min-w-[70px] text-indigo-700">₹{i.subtotal}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drinks */}
          {bill.items.filter(i => i.category === "drinks").length > 0 && (
            <div className="mb-6">
              <h5 className="font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2 tracking-wide">
                BEVERAGES
              </h5>
              <div className="space-y-3">
                {bill.items.filter(i => i.category === "drinks").map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div className="flex-1 text-base font-medium">{i.quantity} × {i.name}</div>
                    <div className="font-semibold text-right min-w-[70px] text-indigo-700">₹{i.subtotal}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bill Summary */}
          <div className="border-t-2 border-dashed border-gray-300 pt-6 mt-6 space-y-3 text-gray-700">
            {bill.totals.foodSubtotal > 0 && (
              <div className="flex justify-between items-center text-base">
                <span>Food Subtotal:</span>
                <span className="font-semibold text-indigo-800 min-w-[70px] text-right">₹{bill.totals.foodSubtotal}</span>
              </div>
            )}
            {bill.totals.drinkSubtotal > 0 && (
              <div className="flex justify-between items-center text-base">
                <span>Beverage Subtotal:</span>
                <span className="font-semibold text-indigo-800 min-w-[70px] text-right">₹{bill.totals.drinkSubtotal}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-base">
              <span>CGST (2.5%):</span>
              <span className="font-semibold text-indigo-800 min-w-[70px] text-right">₹{bill.totals.cgst}</span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span>SGST (2.5%):</span>
              <span className="font-semibold text-indigo-800 min-w-[70px] text-right">₹{bill.totals.sgst}</span>
            </div>
            <div className="border-t-2 border-gray-400 pt-4 mt-4 flex justify-between items-center font-extrabold text-xl text-indigo-900">
              <span>TOTAL AMOUNT:</span>
              <span className="min-w-[80px] text-right">₹{bill.totals.grandTotal}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={paymentProcessing}
          className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition-colors duration-300 ${
            paymentProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {paymentProcessing ? "Processing Payment..." : "Pay Now wit Online"}
        </button>
      </div>
    </div>
  );
}