import Order from "../models/Order.js";
import Table from "../models/Table.js";



// ✅ Get all orders (with filters)
export const getAllOrders = async (req, res) => {
  try {
    const { status, date } = req.query;

    let query = {};
    if (status) query.status = status;
    if (date === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      query.createdAt = { $gte: today, $lt: tomorrow };
    }

    const orders = await Order.find(query).populate("tableId items.menuItemId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
};

// ✅ Recent Orders
export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("tableId items.menuItemId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};

// ✅ Update Order Status (Accept/Reject/Preparing/Served)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, $push: { statusHistory: { status, changedAt: new Date() } } },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// ✅ Generate Bill for an order
// controllers/admin.order.controller.js
export const generateBill = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.menuItemId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const items = order.items.map(i => ({
      name: i.menuItemId?.name || i.name,
      quantity: i.quantity,
      price: i.menuItemId?.price || i.price,
      subtotal: (i.menuItemId?.price || i.price) * i.quantity
    }));

    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
    const taxRate = 0.18;
    const tax = +(subtotal * taxRate).toFixed(2);
    const grandTotal = +(subtotal + tax).toFixed(2);

    res.json({
      orderId: order._id,
      table: order.tableId,
      paymentMethod: order.paymentMethod,
      items,
      totals: { subtotal, tax, grandTotal },
      generatedAt: new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
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