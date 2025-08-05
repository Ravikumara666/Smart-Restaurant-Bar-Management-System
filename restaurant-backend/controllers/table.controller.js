import Table from "../models/Table.js";


// Get all tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tables" });
  }
};

// Add a new table
export const addTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
    const io = req.app.get('io');
    io.emit("tables_updated", updatedTable);

  } catch (err) {
    res.status(500).json({ error: "Failed to add table" });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
    const io = req.app.get('io');
    io.emit("tables_updated", updatedTable);

  } catch (err) {
    res.status(500).json({ error: "Failed to update table" });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  try {

    await Table.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Table deleted" });
    const io = req.app.get('io');
    io.emit("tables_updated", updatedTable);

  } catch (err) {
    res.status(500).json({ error: "Failed to delete table" });
  }
};

// Get table by ID
export const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ error: "Failed to get table" });
  }
};

// Get tables by status (available/busy)
export const getTablesByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const isOccupied = status === 'occupied' ? true : false;
    const tables = await Table.find({ isOccupied });
    // const tables = await Table.find({ status: req.params.status });
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to get tables by status" });
  }
};
