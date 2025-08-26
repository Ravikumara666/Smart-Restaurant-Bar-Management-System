import cron from "node-cron";
import Table from "../models/Table.js";

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  try {
    const updated = await Table.updateMany(
      {
        status: "occupied",
        occupiedAt: { $lt: twoHoursAgo }
      },
      {
        $set: { status: "available", occupiedAt: null }
      }
    );

    if (updated.modifiedCount > 0) {
      console.log(`✅ Auto-freed ${updated.modifiedCount} tables`);
    }
  } catch (error) {
    console.error("❌ Error in auto-free job:", error);
  }
});