import cron from 'node-cron';
import Table from '../models/Table.js';


cron.schedule('*/10 * * * *', async () => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  try {
    await Table.updateMany(
      {
        isOccupied: true,
        sessionStart: { $lte: twoHoursAgo }
      },
      { isOccupied: false }
    );
    console.log("✅ Tables released after 2 hours of inactivity.");
  } catch (err) {
    console.error("❌ Error resetting tables:", err);
  }
});
