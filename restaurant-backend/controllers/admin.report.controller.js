import { Parser } from "json2csv";
import Order from "../models/Order.js";

// ✅ Sales Report with filters
export const getSalesReport = async (req, res) => {
  try {
    const { range, paymentMethod } = req.query;
    let query = {};
    if (paymentMethod) query.paymentMethod = paymentMethod;

    const orders = await Order.find(query);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sales report" });
  }
};


// ✅ Export Sales Report as CSV
export const exportSalesReport = async (req, res) => {
  try {
    // Populate tableId so we get table details
    const orders = await Order.find().populate("tableId");

    // Transform orders into flat objects
    const formattedOrders = orders.map(order => ({
      orderId: order._id,
      tableNumber: order.tableId?.tableNumber || "N/A", // ✅ table name instead of ID
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
    }));

    // Define CSV fields
    const fields = ["orderId", "tableNumber", "totalPrice", "paymentMethod", "status", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedOrders);

    res.header("Content-Type", "text/csv");
    res.attachment("sales_report.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Failed to export sales report", details: err.message });
  }
};