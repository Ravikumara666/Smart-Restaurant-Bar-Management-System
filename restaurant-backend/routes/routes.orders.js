import express from 'express';
import { createOrder, deleteOrder, getAllOrders, getOrderHistory, getOrdersByTableId, updateOrder, updateOrderStatus } from '../controllers/order.controller.js';


const OrderRouter = express.Router();

// Sample route for getting all orders
OrderRouter.get('/', getAllOrders);
OrderRouter.post('/', createOrder);
OrderRouter.put('/:id', updateOrder);
OrderRouter.delete('/:id', deleteOrder);
OrderRouter.get("/table/:tableId", getOrdersByTableId);
OrderRouter.put('/:id/status', updateOrderStatus);
OrderRouter.get('/:id/history', getOrderHistory);


export default OrderRouter;