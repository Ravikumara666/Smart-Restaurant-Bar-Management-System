import Table from "../models/Table.js";



// ✅ All tables
export const getAllTables = async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
};

// ✅ Occupied tables only
export const getOccupiedTables = async (req, res) => {
  const tables = await Table.find({ isOccupied: true });
  res.json(tables);
};

// ✅ Free a table
export const freeTable = async (req, res) => {
  const { id } = req.params;
  const table = await Table.findByIdAndUpdate(id, { isOccupied: false, status: "available" }, { new: true });
  res.json(table);
};