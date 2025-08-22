import express from 'express';
// import { deleteOrder, deleteUser, getAllOrders, getAllUsers, getDashboardStats, getDashboardSummary, getSalesReport, updateOrderStatus, updateUser } from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';
import { getDashboardStats, getDashboardSummary, getRevenueStats, getTopItems } from '../controllers/admin.dashboard.controller.js';

import { generateBill, getAllOrders, getRecentOrders, updateOrderStatus } from '../controllers/admin.order.controller.js';
import { freeTable, getAllTables, getOccupiedTables } from '../controllers/admin.table.controller.js';
import { exportSalesReport, getSalesReport } from '../controllers/admin.report.controller.js';
import { addMenuItem, deleteMenuItem, getMenu, toggleStock, updateMenuItem } from '../controllers/admin.menu.controller.js';
import { adminLogin } from '../controllers/admin.auth.controller.js';
const AdminRouter = express.Router();



AdminRouter.post("/auth/login", adminLogin);

// ------------------ DASHBOARD ------------------ //
AdminRouter.get("/dashboard/summary", getDashboardSummary);
AdminRouter.get("/dashboard/stats", getDashboardStats);
AdminRouter.get("/dashboard/revenue", getRevenueStats );
AdminRouter.get("/dashboard/top-items", getTopItems);
// ------------------ ORDERS ------------------ //
AdminRouter.get("/orders", getAllOrders);
AdminRouter.get("/orders/recent", getRecentOrders);
AdminRouter.put("/orders/:id/status", updateOrderStatus);
AdminRouter.get("/orders/:id/bill", generateBill);

// ------------------ TABLES ------------------ //
AdminRouter.get("/tables", getAllTables);
AdminRouter.get("/tables/occupied", getOccupiedTables);
AdminRouter.put("/tables/:id/free", freeTable);

AdminRouter.get("/menu", getMenu);                     // fetch menu
AdminRouter.post("/menu",upload.single("image"), addMenuItem);                // add new item
AdminRouter.put("/menu/:id",upload.single("image"), updateMenuItem);          // update item
AdminRouter.put("/menu/:id/toggle-stock", toggleStock); // toggle stock
AdminRouter.delete("/menu/:id", deleteMenuItem); 

// ------------------ SALES ------------------ //
AdminRouter.get("/sales",isAdmin, getSalesReport);
AdminRouter.get("/sales/export",isAdmin, exportSalesReport);

export default AdminRouter;