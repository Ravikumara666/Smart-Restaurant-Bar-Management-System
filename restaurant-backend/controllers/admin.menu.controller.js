import MenuItem from "../models/MenuItem.js";

// controllers/admin.menu.controller.js
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";
import MenuItem from "../models/MenuItem.js";



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

// UPDATE menu item
// ✅ UPDATE menu item with optional image
export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let updateData = { name, description, price, category };

    const imageFile = req.file;
    if (imageFile) {
      try {
        const localPath = imageFile.path;
        const publicId = path.parse(imageFile.filename).name;

        const result = await cloudinary.uploader.upload(localPath, {
          public_id: publicId,
          folder: "menu-items",
        });

        updateData.image = result.secure_url;
        fs.unlinkSync(localPath); // Delete local file
      } catch (uploadError) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updatedItem);
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