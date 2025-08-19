import Order from "../models/Order.js";



// ✅ Summary (total orders, revenue, tables, etc.)
export const getDashboardSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);

    res.json({
      totalOrders,
      todaysOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

// ✅ Stats
export const getDashboardStats = async (req, res) => {
  try {
    const paymentStats = await Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);
    const orderStatusStats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({ paymentStats, orderStatusStats });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// ✅ Revenue for graph
export const getRevenueStats = async (req, res) => {
  try {
    const { range = "week" } = req.query;

    // Example: group by day
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch revenue stats" });
  }
};

// ✅ Top Selling Items
export const getTopItems = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const items = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItemId",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top items" });
  }
};