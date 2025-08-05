// controllers/menu.controller.js
import MenuItem from "../models/MenuItem.js";
import fs from 'fs';
import path from "path";
import { v2 as cloudinary } from 'cloudinary';

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// Add a menu item with image

export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    let imageUrl = null;
    const imageFile = req.file;

    // Upload image to Cloudinary if available
    if (imageFile) {
      try {
        const localPath = imageFile.path;
        const publicId = path.parse(imageFile.filename).name;

        const result = await cloudinary.uploader.upload(localPath, {
          public_id: publicId,
          folder: "menu-items", // Optional: keep images organized in Cloudinary
        });

        imageUrl = result.secure_url;
        // Delete local file
        fs.unlinkSync(localPath);
      } catch (uploadError) {

        return res.status(500).json({ message: "Image upload failed", success: false });
      }
    }

    // Save menu item with Cloudinary image URL
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image: imageUrl || "", // use Cloudinary URL
    });

    await menuItem.save();

    res.status(201).json({
      message: "Menu item added successfully",
      success: true,
      menuItem,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// Toggle availability of a menu item
export const toggleMenuAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    item.available = !item.available;
    await item.save();

    res.status(200).json({
      message: `Menu item is now ${item.available ? 'available' : 'unavailable'}`,
      item,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle availability" });
  }
};
// Update image of a menu item
export const updateMenuItemImage = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const localPath = req.file.path;
    const publicId = path.parse(req.file.filename).name;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      folder: "menu-items",
    });

    const imageUrl = result.secure_url;

    // Delete old image from Cloudinary if needed (optional enhancement)

    // Delete local file
    fs.unlinkSync(localPath);

    item.image = imageUrl;
    await item.save();

    res.status(200).json({
      message: "Image updated successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update image" });
  }
};
