import MenuItem from "../models/MenuItem.js";

// controllers/admin.menu.controller.js


// GET all menu items
export const getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD new menu item
export const addMenuItem = async (req, res) => {
  try {
    const newItem = new MenuItem(req.body); // { name, price, description, inStock }
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE menu item
export const updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// TOGGLE stock
export const toggleStock = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.available = !item.available;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE item
export const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};