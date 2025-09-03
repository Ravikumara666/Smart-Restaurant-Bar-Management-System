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

    const orders = await Order.find(query).populate("tableId items.menuItemId additionalItems.menuItemId");
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
// export const generateBill = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("items.menuItemId");
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     const items = order.items.map(i => ({
//       name: i.menuItemId?.name || i.name,
//       quantity: i.quantity,
//       price: i.menuItemId?.price || i.price,
//       subtotal: (i.menuItemId?.price || i.price) * i.quantity
//     }));

//     const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
//     const taxRate = 0.18;
//     const tax = +(subtotal * taxRate).toFixed(2);
//     const grandTotal = +(subtotal + tax).toFixed(2);

//     res.json({
//       orderId: order._id,
//       table: order.tableId,
//       paymentMethod: order.paymentMethod,
//       items,
//       totals: { subtotal, tax, grandTotal },
//       generatedAt: new Date()
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const generateBill = async (req, res) => {
  try {
    // Define categories here
    const drinkCategories = [
      "Wine", "Whiskey", "Beer", "Cocktails", "Mocktails",
      "Hot Drinks", "Beverages"
    ];

    const foodCategories = [
      "Starters", "Veg Dishes", "Chicken Dishes", "Mutton Dishes",
      "Main Course", "Desserts","Cold Drinks"
    ];

    const order = await Order.findById(req.params.id).populate("items.menuItemId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const items = order.items.map(i => ({
      name: i.menuItemId?.name || i.name,
      category: i.menuItemId?.category || "",
      quantity: i.quantity,
      price: i.menuItemId?.price || i.price,
      subtotal: (i.menuItemId?.price || i.price) * i.quantity
    }));

    const foodItems = items.filter(i => foodCategories.includes(i.category));
    const drinkItems = items.filter(i => drinkCategories.includes(i.category));

    const foodSubtotal = foodItems.reduce((sum, i) => sum + i.subtotal, 0);
    const drinkSubtotal = drinkItems.reduce((sum, i) => sum + i.subtotal, 0);

    const cgst = +(foodSubtotal * 0.025).toFixed(2);
    const sgst = +(foodSubtotal * 0.025).toFixed(2);
    const gstTotal = cgst + sgst;
    const grandTotal = +(foodSubtotal + drinkSubtotal + gstTotal).toFixed(2);
    const tableInfo = await Table.findById(order.tableId);
    res.json({
      orderId: order._id,
      table: tableInfo.tableNumber,
      paymentMethod: order.paymentMethod,
      items,
      totals: { foodSubtotal, drinkSubtotal, cgst, sgst, gstTotal, grandTotal },
      generatedAt: new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const markOrderComplete = async (req, res) => {
  try {
    console.log("its coming in mark order complerte")
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // order.status = "completed";
    // await order.save();
console.log("trying to free table")
    // ✅ Free the table
    await Table.findByIdAndUpdate(order.tableId, {
      status: "available",
      occupiedAt: null,
    });
    console.log("table set free")

    const io = req.app.get("io");
    if (io) io.emit("orderCompleted", order);

    res.status(200).json({ message: "Order marked as complete", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark order complete", details: err.message });
  }
};

export const rejectAdditionalItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectIds } = req.body; // array of item IDs

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Remove rejected items
    order.items = order.items.filter(i => !rejectIds.includes(i._id.toString()));

    // Recalculate total
    let newTotal = 0;
    for (const i of order.items) {
      const menuItem = await MenuItem.findById(i.menuItemId);
      newTotal += (menuItem.price || 0) * (i.quantity || 1);
    }
    order.totalPrice = newTotal;

    await order.save();

    const io = req.app.get("io");
    if (io) io.emit("orderUpdated", order);

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to reject additional items", details: err.message });
  }
};

export const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    console.log("its coming in uops")
    console.log(id)
    console.log(paymentStatus)

    if (!["Pending", "Paid"].includes(paymentStatus)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
console.log(order)
    order.paymentStatus = paymentStatus;

    await order.save();

    // Emit socket event for real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("orderPaymentUpdated", {
        orderId: order._id,
        paymentStatus: order.paymentStatus
      });
    }
    console.log(object)
    res.status(200).json({ message: "Payment status updated", order });
  } catch (err) {
    console.error("❌ updateOrderPaymentStatus Error:", err.message);
    res.status(500).json({ error: "Failed to update payment status" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};