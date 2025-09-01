import cron from "node-cron";
import Order from "../models/Order.js";

cron.schedule("*/10 * * * *", async () => {
  await Order.updateMany(
    { expiresAt: { $lt: new Date() }, status: { $nin: ["completed", "cancelled"] } },
    { status: "cancelled" }
  );
});