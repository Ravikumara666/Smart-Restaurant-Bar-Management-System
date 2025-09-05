import React from "react";
import { useParams } from "react-router-dom";
import BillSummary from "../components/BillSummary";

export default function PaymentPage() {
  const { orderId } = useParams(); 

  if (!orderId) {
    return <p className="text-center mt-6">No order selected.</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <BillSummary orderId={orderId} onClose={() => navigate(`/order-status/${orderId}`)} />
    </div>
  );
}