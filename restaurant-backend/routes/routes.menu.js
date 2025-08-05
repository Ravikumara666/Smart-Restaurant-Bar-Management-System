import express from 'express';
import { addMenuItem, deleteMenuItem, getAllMenuItems, toggleMenuAvailability, updateMenuItem, updateMenuItemImage } from '../controllers/menu.controller.js';
import upload from '../middleware/upload.js';
const MenuRouter = express.Router();

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     responses:
 *       200:
 *         description: A list of menu items
 */
// Sample route for getting the menu
MenuRouter.get('/',getAllMenuItems);
MenuRouter.post('/',upload.single("image"),addMenuItem);
MenuRouter.put('/:id/image', upload.single('image'), updateMenuItemImage);
MenuRouter.delete('/:id',deleteMenuItem);
MenuRouter.patch('/:id/toggle', toggleMenuAvailability); // [Optional]

export default MenuRouter;