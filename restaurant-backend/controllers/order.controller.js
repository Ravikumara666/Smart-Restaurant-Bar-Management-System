import Order from "../models/Order.js";
import Table from "../models/Table.js";
import MenuItem from "../models/MenuItem.js";

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


    const { tableNumber, items, totalPrice, paymentMethod, notes, placedBy } = req.body;

    if (!tableNumber || !items || !items.length) {

      return res.status(400).json({ error: "Table number and items are required" });
    }

    const table = await Table.findOne({ tableNumber: tableNumber.trim() });


    if (!table) {
      console.error("❌ Invalid table number:", tableNumber);

    }

    const order = new Order({
      tableId: table._id,
      items,
      totalPrice,
      paymentMethod: paymentMethod || "Cash",
      notes: notes || "",
      placedBy: placedBy || "",
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
    });

 

    await order.save();


    await Table.findByIdAndUpdate(table._id, {
      status: "occupied",
      occupiedAt: new Date(),
    });

    const io = req.app.get("io");
    console.log("📡 Socket.IO instance:", io ? "Available" : "Not Available");

    if (io) {
      io.emit("orderCreated", {
        message: "New order created",
        orderId: order._id,
        tableNumber: tableNumber,
        totalPrice,
        itemsCount: items.length,
        status: order.status
      });
      console.log("📢 Emitted orderCreated event");
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({ error: "Order creation failed", details: err.message });
  }
};

export const addItemsToOrder = async (req, res) => {
  try {


    const { id } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required." });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (order.status === "completed") return res.status(400).json({ error: "Cannot add items to a completed order." });

    order.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    if (order.status === "served") order.status = "pending";

    if (!order.additionalItems) order.additionalItems = [];
    order.additionalItems.push(...items);

    const menuItemIds = items.map(it => it.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    const priceMap = {};
    menuItems.forEach(mi => (priceMap[mi._id.toString()] = mi.price));

    let additionalTotal = 0;
    items.forEach(it => {
      const price = priceMap[it.menuItemId?.toString()];
      if (price) additionalTotal += price * (it.quantity || 1);
    });

    order.additionalPrice = (order.additionalPrice || 0) + additionalTotal;
    order.totalPrice += additionalTotal;

    await order.save();

const populatedOrder = await Order.findById(order._id)
  .populate({
    path: "items.menuItemId",
    select: "name price category description"
  })
  .populate({
    path: "additionalItems.menuItemId",
    select: "name price category description"
  });

    const io = req.app.get("io");
    if (io) {
      io.emit("orderUpdated", {
        message: "Additional items added to order",
        orderId: order._id,
        newAdditionalItems: items.map(it => ({
          name: it.name || it.menuItemId?.name,
          quantity: it.quantity
        })),
        addedItemsCount: items.length,
        newAdditionalPrice: order.additionalPrice,
        newTotalPrice: order.totalPrice,
        status: order.status
      });
    }

    console.log(populatedOrder)

    res.status(200).json(populatedOrder);
  } catch (err) {
    console.error("❌ Error in addItemsToOrder:", err.message);
    res.status(500).json({ error: "Failed to add items to order", details: err.message });
  }
};
// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
  .populate({
    path: "items.menuItemId",
    select: "name price category description"
  })
  .populate({
    path: "additionalItems.menuItemId",
    select: "name price category description"
  });
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
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status === "completed") {
      return res.status(400).json({ error: "Use /mark-complete endpoint to complete the order." });
    }

    order.status = status;
    await order.save();

    const io = req.app.get("io");
    if (io) io.emit("orderStatusUpdated", order);

    res.status(200).json(order);
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

// Add items to an existing order


// ✅ Mark order as complete
