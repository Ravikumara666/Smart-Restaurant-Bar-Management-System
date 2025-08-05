import Order from "../models/Order.js";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { tableId } = req.body;

    // Step 1: Create order
    const order = new Order(req.body);
    await order.save();

    // Step 2: Set table occupied and record session start time
    await Table.findByIdAndUpdate(tableId, {
      isOccupied: true,
      sessionStart: new Date(),
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
};

// Update order (status, items)
export const updateOrder = async (req, res) => {
  try {
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
