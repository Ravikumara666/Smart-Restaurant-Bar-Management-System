import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: Number,
  method: String, // UPI, Cash, Card
  status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  transactionId: String, // Provided by gateway
  createdAt: { type: Date, default: Date.now }
});

const Payment =mongoose.model("Payment",PaymentSchema)
export default Payment