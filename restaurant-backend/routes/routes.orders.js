import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  addItemsToOrder,
} from "../controllers/order.controller.js";

const OrderRouter = express.Router();

OrderRouter.get("/", getAllOrders);
OrderRouter.post("/", createOrder);
OrderRouter.put("/:id", updateOrder);
OrderRouter.get("/:id", getOrderById);

// OrderRouter.put("/:id/status", updateOrderStatus);
// OrderRouter.get("/:id/history", getOrderHistory);

// ✅ New Routes
OrderRouter.post("/:id/items", addItemsToOrder);


export default OrderRouter;