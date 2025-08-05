import express from 'express';
import { deleteOrder, deleteUser, getAllOrders, getAllUsers, getDashboardStats, getDashboardSummary, getSalesReport, updateOrderStatus, updateUser } from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';
const AdminRouter = express.Router();


AdminRouter.use(isAdmin)
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
