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

export const createOrder = async (req, res) => {
  try {
    console.log("🔹 Creating a new order...");
    console.log("📦 Incoming Request Body:", req.body);

    const { tableNumber, items, totalPrice, paymentMethod, notes, placedBy } = req.body;

    if (!tableNumber) {
      console.error("❌ No table number provided");
      return res.status(400).json({ error: "Table number is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ No items provided or items format invalid");
      return res.status(400).json({ error: "Items are required and must be an array" });
    }

    // Step 1: Verify table exists
    console.log(`🔍 Looking up table: "${tableNumber.trim()}"`);
    const table = await Table.findOne({ tableNumber: tableNumber.trim() });

    if (!table) {
      console.error(`❌ Table "${tableNumber}" not found`);
      return res.status(400).json({ error: "Invalid table number" });
    }

    console.log("✅ Table found:", table);

    // Step 2: Create order
    const order = new Order({
      tableId: table._id,
      items,
      totalPrice,
      paymentMethod: paymentMethod || "Cash",
      notes: notes || "",
      placedBy: placedBy || "",
    });

    console.log("📝 Saving order:", order);
    await order.save();
    console.log("✅ Order saved successfully");

    // Step 3: Mark table as occupied
    console.log(`🔄 Updating table "${table.tableNumber}" status to 'occupied'`);
    await Table.findByIdAndUpdate(table._id, { status: "occupied" });

    console.log("✅ Table status updated");

    // ✅ Step 4: Emit socket event for real-time notifications
    const io = req.app.get('io'); // Access io from Express app
    io.emit("newOrder", {
      _id: order._id,
      tableNumber: table.tableNumber,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    });

    console.log("📢 Socket event emitted: newOrder");

    res.status(201).json(order);
  } catch (err) {
    console.error("🔥 Error in createOrder:", err);
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
