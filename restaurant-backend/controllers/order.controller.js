import Order from "../models/Order.js";
import Table from "../models/Table.js";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    console.log("Getting all Orders")
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Create new order

// controllers/order.controller.js
export const createOrder = async (req, res) => {
  try {
    const { tableNumber, items, totalPrice, paymentMethod, notes, placedBy } = req.body;

    if (!tableNumber || !items || !items.length) {
      return res.status(400).json({ error: "Table number and items are required" });
    }

    const table = await Table.findOne({ tableNumber: tableNumber.trim() });
    if (!table) {
      return res.status(400).json({ error: "Invalid table number" });
    }

    const order = new Order({
      tableId: table._id,
      items,
      totalPrice,
      paymentMethod: paymentMethod || "Cash",
      notes: notes || "",
      placedBy: placedBy || "",
    });

    await order.save();

    // ✅ Update table status & set occupiedAt
    await Table.findByIdAndUpdate(table._id, {
      status: "occupied",
      occupiedAt: new Date()
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed", details: err.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.menuItemId");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};


// Update order (status, items)
export const updateOrder = async (req, res) => {
  try {
    console.log("Updating the order")
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

    // Auto-release table if status is Served or Cancelled
    if (["Served", "Cancelled"].includes(updatedOrder.status)) {
      await Table.findByIdAndUpdate(updatedOrder.tableId, {
        isOccupied: false,
      });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
};


// Delete order
export const deleteOrder = async (req, res) => {
  try {
    console.log("deleting the order")
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// Get orders by table ID
export const getOrdersByTableId = async (req, res) => {
  try {
    const orders = await Order.find({ tableId: req.params.tableId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch table orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  console.log("Updateing order status")
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

  const io = req.app.get('io');
  io.emit('orderStatusUpdated', order); // Notify all clients

  res.status(200).json(order);
};

export const getOrderHistory = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  res.status(200).json(order.statusHistory);
};
