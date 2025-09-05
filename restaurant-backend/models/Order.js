import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
      quantity: { type: Number, default: 1, min: 1 },
      type: { type: String, enum: ["original", "additional"], default: "original" }
    }
  ],
  additionalItems: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
      quantity: { type: Number, default: 1, min: 1 }
    }
  ],
  totalPrice: { type: Number, required: true, min: 0 },
  additionalPrice: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "confirmed", "preparing", "ready", "served", "cancelled", "completed"], default: "pending" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Partial", "Refunded"], default: "Pending" },
  paymentMethod: { type: String, enum: ["cash", "card", "upi"], default: "cash" },
  isTakeaway: { type: Boolean, default: false },
  notes: { type: String, default: "" },
  placedBy: { type: String, default: "" }
}, { timestamps: true });

// ✅ Middleware to add status history
OrderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status });
  }
  next();
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;