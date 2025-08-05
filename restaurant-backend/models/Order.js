import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Preparing", "Ready", "Served", "Cancelled"],
    default: "Preparing",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Partial", "Refunded"],
    default: "Pending",
  },
  isTakeaway: { type: Boolean, default: false },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  placedBy: { type: String, default: "" },
  paymentMethod: { type: String, enum: ["Cash", "Card", "UPI"], default: "Cash" },


});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
