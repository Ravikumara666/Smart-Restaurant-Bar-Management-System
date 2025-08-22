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

// Add a new table
export const addTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    const savedTable = await table.save();

    res.status(201).json(savedTable);
  } catch (err) {
    res.status(500).json({ error: "Failed to add table" });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update table" });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  try {
    const deleted = await Table.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Table deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete table" });
  }
};