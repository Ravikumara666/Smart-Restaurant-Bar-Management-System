import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  addItemsToOrder,
} from "../controllers/order.controller.js";
import { generateBill } from "../controllers/admin.order.controller.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";

const OrderRouter = express.Router();

OrderRouter.get("/", getAllOrders);
OrderRouter.post("/", createOrder);
OrderRouter.put("/:id", updateOrder);
OrderRouter.get("/:id", getOrderById);
OrderRouter.get("/:id/bill", generateBill);

// OrderRouter.put("/:id/status", updateOrderStatus);
// OrderRouter.get("/:id/history", getOrderHistory);

// ✅ New Routes
OrderRouter.post("/:id/items", addItemsToOrder);


OrderRouter.post("/razorpay/order", createRazorpayOrder);
OrderRouter.post("/razorpay/verify", verifyPayment);

export default OrderRouter;