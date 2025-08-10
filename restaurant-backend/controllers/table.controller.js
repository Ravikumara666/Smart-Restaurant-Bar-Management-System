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
    const savedTable = await table.save();

    const io = req.app.get("io");
    io.emit("tables_updated", savedTable);

    res.status(201).json(savedTable);
  } catch (err) {
    res.status(500).json({ error: "Failed to add table" });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const io = req.app.get("io");
    io.emit("tables_updated", updated);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update table" });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  try {
    const deleted = await Table.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    io.emit("tables_updated", deleted);

    res.status(200).json({ message: "Table deleted", deleted });
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

// Get tables by status (available / occupied / reserved / merged)
export const getTablesByStatus = async (req, res) => {
  try {
    const status = req.params.status.toLowerCase();
    const tables = await Table.find({ status });
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to get tables by status" });
  }
};

// Assign customer to a table
export const assignTable = async (req, res) => {
  try {
    const { customerName, partySize, reservationTime, specialRequest } = req.body;
    const tableId = req.params.id;

    const updated = await Table.findByIdAndUpdate(
      tableId,
      {
        customerName,
        partySize,
        reservationTime,
        specialRequest,
        status: "occupied",
      },
      { new: true }
    );

    const io = req.app.get("io");
    io.emit("tables_updated", updated);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign table" });
  }
};

// Merge selected tables into a new table
export const mergeTables = async (req, res) => {
  try {
    const { selectedTables, newTableName, totalCapacity } = req.body;

    // Mark selected tables as merged
    await Table.updateMany(
      { tableNumber: { $in: selectedTables } },
      { status: "merged", isMerged: true }
    );

    // Create new merged table
    const newTable = new Table({
      tableNumber: newTableName,
      capacity: totalCapacity,
      status: "available",
      isMerged: false,
      mergedTables: selectedTables,
    });

    const savedTable = await newTable.save();

    const io = req.app.get("io");
    io.emit("tables_updated", savedTable);

    res.status(201).json(savedTable);
  } catch (err) {
    res.status(500).json({ error: "Failed to merge tables" });
  }
};
