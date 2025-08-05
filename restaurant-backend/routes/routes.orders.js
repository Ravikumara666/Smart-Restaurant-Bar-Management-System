import express from 'express';
import { createOrder, deleteOrder, getAllOrders, getOrdersByTableId, updateOrder } from '../controllers/order.controller.js';


const OrderRouter = express.Router();

// Sample route for getting all orders
OrderRouter.get('/', getAllOrders);
OrderRouter.post('/', createOrder);
OrderRouter.put('/:id', updateOrder);
OrderRouter.delete('/:id', deleteOrder);
OrderRouter.get("/table/:tableId", getOrdersByTableId);

export default OrderRouter;