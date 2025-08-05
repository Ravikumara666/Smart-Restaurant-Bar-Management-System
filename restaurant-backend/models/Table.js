import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  qrCode: { type: String, default: "" }, // Can be URL or base64
  isOccupied: { type: Boolean, default: false },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  sessionToken: { type: String }, // Optional for session validation
  sessionStart: { type: Date, default: Date.now },

});

const Table = mongoose.model("Table", TableSchema);
export default Table;
