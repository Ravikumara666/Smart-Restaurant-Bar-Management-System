import express from 'express';
import { addMenuItem, deleteMenuItem, getAllMenuItems, updateMenuItem } from '../controllers/menu.controller.js';
import upload from '../middleware/upload.js';
const MenuRouter = express.Router();

// Sample route for getting the menu
MenuRouter.get('/',getAllMenuItems);
MenuRouter.post('/',upload.single("image"),addMenuItem);
MenuRouter.put('/:id',updateMenuItem);
MenuRouter.delete('/:id',deleteMenuItem);

export default MenuRouter;