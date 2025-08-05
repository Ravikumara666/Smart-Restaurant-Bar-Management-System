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
