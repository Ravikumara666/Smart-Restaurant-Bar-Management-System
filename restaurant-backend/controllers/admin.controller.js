// import Order from "../models/Order.js";
// import User from "../models/User.js";
// import MenuItem from "../models/MenuItem.js";
// import Table from "../models/Table.js";

// // Get admin dashboard summary
// export const getDashboardSummary = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // 1. Total Orders
//     const totalOrders = await Order.countDocuments();

//     // 2. Today's Orders
//     const todaysOrders = await Order.countDocuments({
//       createdAt: { $gte: today }
//     });

//     // 3. Total Revenue
//     const totalRevenueResult = await Order.aggregate([
//       { $match: { paymentStatus: "Paid" } },
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } }
//     ]);
//     const totalRevenue = totalRevenueResult[0]?.total || 0;

//     // 4. Payment Method Distribution
//     const paymentStats = await Order.aggregate([
//       {
//         $group: {
//           _id: "$paymentMethod",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // 5. Order Status Distribution
//     const orderStatusStats = await Order.aggregate([
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // 6. Most Ordered Items
//     const mostOrderedItems = await Order.aggregate([
//       { $unwind: "$items" },
//       {
//         $group: {
//           _id: "$items.menuItemId",
//           totalQuantity: { $sum: "$items.quantity" }
//         }
//       },
//       {
//         $lookup: {
//           from: "menuitems",
//           localField: "_id",
//           foreignField: "_id",
//           as: "menuItem"
//         }
//       },
//       { $unwind: "$menuItem" },
//       {
//         $project: {
//           name: "$menuItem.name",
//           totalQuantity: 1
//         }
//       },
//       { $sort: { totalQuantity: -1 } },
//       { $limit: 5 }
//     ]);

//     // 7. Table Occupancy
//     const totalTables = await Table.countDocuments();
//     const occupiedTables = await Table.countDocuments({ isOccupied: true });

//     res.json({
//       totalOrders,
//       todaysOrders,
//       totalRevenue,
//       paymentStats,
//       orderStatusStats,
//       mostOrderedItems,
//       totalTables,
//       occupiedTables,
//     });

//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).json({ error: "Failed to fetch dashboard data" });
//   }
// };

// export const getDashboardStats = async (req, res) => {
//   try {
//     const totalOrders = await Order.countDocuments();
//     const pendingOrders = await Order.countDocuments({ status: "Preparing" });
//     const servedOrders = await Order.countDocuments({ status: "Served" });

//     const totalRevenueAgg = await Order.aggregate([
//       { $match: { paymentStatus: "Paid" } },
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } },
//     ]);
//     const totalRevenue = totalRevenueAgg[0]?.total || 0;

//     const totalUsers = await User.countDocuments({ role: "user" });

//     res.status(200).json({
//       totalOrders,
//       pendingOrders,
//       servedOrders,
//       totalRevenue,
//       totalUsers,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch dashboard stats" });
//   }
// };

// // Get all orders
// // export const getAllOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find().populate("tableId items.menuItemId");
// //     res.status(200).json(orders);
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to fetch orders" });
// //   }
// // };
// export const getAllOrders = async (req, res) => {
//   try {
//     const { status, date } = req.query;

//     let query = {};
//     if (status) query.status = status;
//     if (date === "today") {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const tomorrow = new Date(today);
//       tomorrow.setDate(today.getDate() + 1);
//       query.createdAt = { $gte: today, $lt: tomorrow };
//     }

//     const orders = await Order.find(query).populate("tableId items.menuItemId");
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch orders", details: err.message });
//   }
// };

// // ✅ Recent Orders
// export const getRecentOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .populate("tableId items.menuItemId");
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch recent orders" });
//   }
// };

// // ✅ Update Order Status (Accept/Reject/Preparing/Served)
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const order = await Order.findByIdAndUpdate(
//       id,
//       { status, $push: { statusHistory: { status, changedAt: new Date() } } },
//       { new: true }
//     );

//     if (!order) return res.status(404).json({ error: "Order not found" });
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update order status" });
//   }
// };

// // ✅ Generate Bill for an order
// export const generateBill = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id).populate("items.menuItemId");

//     if (!order) return res.status(404).json({ error: "Order not found" });

//     // Mark table as free after billing
//     await Table.findByIdAndUpdate(order.tableId, { status: "available", isOccupied: false });

//     // Example bill data
//     const bill = {
//       orderId: order._id,
//       table: order.tableId,
//       items: order.items.map((i) => ({
//         name: i.menuItemId.name,
//         quantity: i.quantity,
//         price: i.menuItemId.price,
//         subtotal: i.quantity * i.menuItemId.price,
//       })),
//       total: order.totalPrice,
//       paymentMethod: order.paymentMethod,
//       generatedAt: new Date(),
//     };

//     res.json(bill);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to generate bill" });
//   }
// };

// // Delete an order
// export const deleteOrder = async (req, res) => {
//   try {
//     await Order.findByIdAndDelete(req.params.orderId);
//     res.status(200).json({ message: "Order deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete order" });
//   }
// };

// // Get sales report (last 7 days)
// export const getSalesReport = async (req, res) => {
//   try {
//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 7);

//     const report = await Order.aggregate([
//       { $match: { createdAt: { $gte: last7Days }, paymentStatus: "Paid" } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           totalSales: { $sum: "$totalPrice" },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     res.status(200).json(report);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch sales report" });
//   }
// };

// // Get all users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({ role: "user" }).select("-password");
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };

// // Update user (role or block status)
// export const updateUser = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       req.body,
//       { new: true }
//     ).select("-password");
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update user" });
//   }
// };

// // Delete a user
// export const deleteUser = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.userId);
//     res.status(200).json({ message: "User deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete user" });
//   }
// };
