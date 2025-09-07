// src/components/PaymentResult.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentResult({ status, details, onClose }) {
  const isSuccess = status === "success";
  const navigate = useNavigate();

  const handleClose = () => {
    if (details && details.orderId) {
      navigate(`/order-status/${details.orderId}`);
    } else {
      onClose();
    }
  };

  const paymentDate = details && details.date ? new Date(details.date) : new Date();
  const formattedDate = paymentDate.toLocaleString();

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 px-4`}>
      <div
        className={`rounded-3xl p-8 max-w-md w-full shadow-xl text-center ${
          isSuccess ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        }`}
      >
        <div className="text-3xl font-bold mb-4">
          {isSuccess ? "✅ Payment Successful" : "❌ Payment Failed"}
        </div>
        <div className="mb-6 text-sm">
          {isSuccess
            ? "Thank you! Your payment has been processed."
            : "Something went wrong with your payment. Please try again."}
        </div>

        {details && (
          <div className="bg-white rounded-lg shadow p-4 mb-6 text-left text-gray-700 text-sm">
            <p><strong>Order ID:</strong> {details.orderId}</p>
            <p><strong>Transaction ID:</strong> {details.transactionId}</p>
            <p><strong>Amount:</strong> ₹{details.amount}</p>
            <p><strong>Status:</strong> {isSuccess ? "Paid" : "Failed"}</p>
            <p><strong>Date &amp; Time:</strong> {formattedDate}</p>
            {details.paymentMethod && <p><strong>Payment Method:</strong> {details.paymentMethod}</p>}
          </div>
        )}

        <button
          onClick={handleClose}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${
            isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
}