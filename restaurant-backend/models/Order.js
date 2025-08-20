import mongoose from "mongoose";

const statusEnum = ["pending","confirmed","preparing", "ready", "delivered", "cancelled"];
const paymentStatusEnum = ["Pending", "Paid", "Partial", "Refunded"];
const paymentMethodEnum = ["cash", "card", "UPI"];

const OrderSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],

    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: statusEnum,
      default: "pending",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: statusEnum,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    paymentStatus: {
      type: String,
      enum: paymentStatusEnum,
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: paymentMethodEnum,
      default: "Cash",
    },

    isTakeaway: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },

    placedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Auto handles createdAt and updatedAt
  }
);

// 🔁 Middleware to track status changes
OrderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status });
  }
  next();
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
