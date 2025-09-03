import { Parser } from "json2csv";
import Order from "../models/Order.js";

// ✅ Parse range into date filter
const getDateRange = (range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "1 Week": {
      const date = new Date(now.getTime());
      date.setDate(date.getDate() - 7);
      startDate = date;
      break;
    }
    case "1 Month": {
      const date = new Date(now.getTime());
      date.setMonth(date.getMonth() - 1);
      startDate = date;
      break;
    }
    case "6 Months": {
      const date = new Date(now.getTime());
      date.setMonth(date.getMonth() - 6);
      startDate = date;
      break;
    }
    case "1 Year": {
      const date = new Date(now.getTime());
      date.setFullYear(date.getFullYear() - 1);
      startDate = date;
      break;
    }
    case "5 Years": {
      const date = new Date(now.getTime());
      date.setFullYear(date.getFullYear() - 5);
      startDate = date;
      break;
    }
    default: {
      const date = new Date(now.getTime());
      date.setMonth(date.getMonth() - 1); // Default 1 month
      startDate = date;
    }
  }
  return startDate;
};

// ✅ Sales Report API
export const getSalesReport = async (req, res) => {
  try {
    const { range = "1 Month" } = req.query;
    const startDate = getDateRange(range);

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1
        }
      }
    ]);

    res.json(sales);
  } catch (err) {
    console.error("❌ [GET SALES ERROR]:", err);
    res.status(500).json({ error: "Failed to fetch sales report" });
  }
};

// ✅ Export Sales Report as CSV
export const exportSalesReport = async (req, res) => {
  try {
    const { range = "1 Month" } = req.query;
    const startDate = getDateRange(range);

    const orders = await Order.find({ createdAt: { $gte: startDate } }).populate("tableId");

    const formattedOrders = orders.map(order => {
      const createdAt = new Date(order.createdAt);
      
      // Date (DD/MM/YYYY)
      const day = String(createdAt.getDate()).padStart(2, "0");
      const month = String(createdAt.getMonth() + 1).padStart(2, "0");
      const year = createdAt.getFullYear();
      const date = `${day}/${month}/${year}`;

      // Time (hh:mm AM/PM)
      let hours = createdAt.getHours();
      const minutes = String(createdAt.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const time = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

      // Customer name
      const customerName = order.tableId?.customerName || "N/A";

      // Price formatted with ₹
      const price = `₹${order.totalPrice.toFixed(2)}`;

      return {
        date,
        customerName,
        time,
        price,
        paymentMethod: order.paymentMethod,
        status: order.status
      };
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    // Append summary row
    formattedOrders.push({
      date: "TOTAL",
      customerName: "",
      time: "",
      price: `₹${totalRevenue.toFixed(2)}`,
      paymentMethod: "",
      status: ""
    });

    const fields = ["date", "customerName", "time", "price", "paymentMethod", "status"];
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedOrders);

    res.header("Content-Type", "text/csv");
    const safeRange = range.replace(/\s+/g, "_");
    res.attachment(`sales_report_${safeRange}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error("❌ [EXPORT CSV ERROR]:", err);
    res.status(500).json({ error: "Failed to export sales report", details: err.message });
  }
};