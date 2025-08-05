import express from 'express';
import { addTable, deleteTable, getAllTables, getTableById, getTablesByStatus, updateTable } from '../controllers/table.controller.js';

const TableRouter = express.Router();

// Sample route for getting all tables
TableRouter.get('/', getAllTables);
// Sample route for adding a new table
TableRouter.post('/', addTable);
// Sample route for updating a table
TableRouter.put('/:id', updateTable);
// Sample route for deleting a table
TableRouter.delete('/:id', deleteTable);
// Sample route for getting a table by ID
TableRouter.get('/:id', getTableById);
// Sample route for getting tables by status
TableRouter.get('/status/:status', getTablesByStatus);

export default TableRouter;