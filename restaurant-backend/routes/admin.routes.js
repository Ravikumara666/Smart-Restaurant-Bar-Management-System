import express from 'express';
import { deleteOrder, deleteUser, getAllOrders, getAllUsers, getDashboardStats, getDashboardSummary, getSalesReport, updateOrderStatus, updateUser } from '../controllers/admin.controller.js';
const AdminRouter = express.Router();

// Admin Dashboard Summary
AdminRouter.get('/dashboard/summary', getDashboardSummary);
AdminRouter.get('/dashboard/stats',getDashboardStats);


// Orders
AdminRouter.get('/orders', getAllOrders);
AdminRouter.put('/orders/:id', updateOrderStatus);
AdminRouter.delete('/orders/:id', deleteOrder);

// Sales Reports
AdminRouter.get('/sales', getSalesReport);

// User Management (optional)
AdminRouter.get('/users', getAllUsers);
AdminRouter.put('/users/:id', updateUser);
AdminRouter.delete('/users/:id', deleteUser);

export default AdminRouter;
