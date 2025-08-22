import Order from "../models/Order.js";
import Table from "../models/Table.js";



// ✅ Summary (total orders, revenue, tables, etc.)
export const getDashboardSummary = async (req, res) => {
  try {
    const { range = "today" } = req.query;

    const now = new Date();
    const dateFilter = {};

    if (range === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      dateFilter.createdAt = { $gte: startOfDay };
    } else if (range === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      dateFilter.createdAt = { $gte: lastWeek };
    } else if (range === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      dateFilter.createdAt = { $gte: lastMonth };
    } else if (range === "year") {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      dateFilter.createdAt = { $gte: lastYear };
    }

    // ✅ Total orders
    const totalOrders = await Order.countDocuments(dateFilter);

    // ✅ Total revenue (only Served)
    const totalRevenueAgg = await Order.aggregate([
      { $match: { ...dateFilter, status: "Served" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // ✅ Table info
    const totalTables = await Table.countDocuments();
    const occupiedTables = await Table.countDocuments({ status: "occupied" });

    res.json({
      totalOrders,
      totalRevenue,
      totalTables,
      occupiedTables,
    });
  } catch (err) {
    console.error("[DASHBOARD ERROR]", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};


// ✅ Stats
export const getDashboardStats = async (req, res) => {
  try {
    const { range = "today" } = req.query;
    const dateFilter = getDateRangeQuery(range);

    const paymentStats = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);

    const orderStatusStats = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
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
    const dateFilter = getDateRangeQuery(range);

    const data = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
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
    const { limit = 5, range = "today" } = req.query;

    // Date filter for today/week/month/year
    const dateFilter = {};
    const now = new Date();
    if (range === "today") {
      dateFilter.createdAt = { $gte: new Date().setHours(0, 0, 0, 0) };
    } else if (range === "week") {
      dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    } else if (range === "month") {
      dateFilter.createdAt = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
    } else if (range === "year") {
      dateFilter.createdAt = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
    }

    const items = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItemId",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "menuitems", // Your menu item collection name
          localField: "_id",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: "$itemDetails" },
      {
        $project: {
          _id: 0,
          name: "$itemDetails.name",
          totalQuantity: 1,
        },
      },
    ]);

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top items" });
  }
};


const getDateRangeQuery = (range) => {
  const now = new Date();
  if (range === "today") {
    return { $gte: new Date(now.setHours(0, 0, 0, 0)) };
  }
  if (range === "week") {
    return { $gte: new Date(now.setDate(now.getDate() - 7)) };
  }
  if (range === "month") {
    return { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
  }
  if (range === "year") {
    return { $gte: new Date(now.getFullYear(), 0, 1) };
  }
  return {}; // Default: no filter
};
