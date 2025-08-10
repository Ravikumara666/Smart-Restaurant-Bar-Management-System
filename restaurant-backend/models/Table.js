import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "occupied", "reserved", "merged"],
    default: "available",
  },
  customerName: { type: String, default: "" },
  reservationTime: { type: String, default: "" }, // store time as "2:15 PM"
  partySize: { type: Number, default: 0 },
  specialRequest: { type: String, default: "" },

  qrCode: { type: String, default: "" }, // optional
  isMerged: { type: Boolean, default: false },
  mergedTables: [{ type: String }], // store merged table numbers

  createdAt: { type: Date, default: Date.now },
});

const Table = mongoose.model("Table", TableSchema);
export default Table;
