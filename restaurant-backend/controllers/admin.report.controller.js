import { Parser } from "json2csv";
import Order from "../models/Order.js";

// ✅ Parse range into date filter
const getDateRange = (range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "1 Week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "1 Month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "6 Months":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case "1 Year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    case "5 Years":
      startDate = new Date(now.setFullYear(now.getFullYear() - 5));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // Default 1 month
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
    const orders = await Order.find().populate("tableId");

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

    const fields = ["date", "customerName", "time", "price", "paymentMethod", "status"];
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedOrders);

    res.header("Content-Type", "text/csv");
    res.attachment("sales_report.csv");
    return res.send(csv);
  } catch (err) {
    console.error("❌ [EXPORT CSV ERROR]:", err);
    res.status(500).json({ error: "Failed to export sales report", details: err.message });
  }
};