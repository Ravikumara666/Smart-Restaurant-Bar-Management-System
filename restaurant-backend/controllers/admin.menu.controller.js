import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import MenuItem from "../models/MenuItem.js";

// ✅ GET all menu items
export const getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    console.error("❌ [GET MENU] Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD new menu item
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      console.error("❌ [ADD ITEM] Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = null;
    const imageFile = req.file;
    // Upload image to Cloudinary if available
    if (imageFile) {
      try {
        const localPath = imageFile.path;
        const publicId = path.parse(imageFile.filename).name;
        const result = await cloudinary.uploader.upload(localPath, {
          public_id: publicId,
          folder: "menu-items",
        });

        imageUrl = result.secure_url;

        // Delete local file
        fs.unlinkSync(localPath);
      } catch (uploadError) {
        console.error("❌ [CLOUDINARY UPLOAD ERROR]:", uploadError);
        return res.status(500).json({ message: "Image upload failed", success: false });
      }
    }

    // Save menu item with Cloudinary image URL
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image: imageUrl || "",
    });

    await menuItem.save();
    res.status(201).json({
      message: "Menu item added successfully",
      success: true,
      menuItem,
    });
  } catch (err) {
    console.error("❌ [ADD ITEM ERROR]:", err);
    res.status(500).json({ error: "Failed to add menu item" });
  }
};

// ✅ UPDATE menu item (with optional image)
export const updateMenuItem = async (req, res) => {
  try {
 const bodyData = req.body || {};
    const { name, description, price, category, spiceLevel, discount, isVeg } = bodyData;

    let updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (category) updateData.category = category;
    if (spiceLevel !== undefined) updateData.spiceLevel = spiceLevel;
    if (discount !== undefined) updateData.discount = discount;
    if (isVeg !== undefined) updateData.isVeg = (isVeg === "true" || isVeg === true);

    // Handle image upload
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
        fs.unlinkSync(localPath);
      } catch (uploadError) {
        console.error("❌ [UPDATE IMAGE UPLOAD ERROR]:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    console.log("🔍 Updating Menu Item:", updateData);

    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedItem) {
      console.error("❌ [DB UPDATE] Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    console.error("❌ [UPDATE ITEM ERROR]:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ TOGGLE stock
export const toggleStock = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      console.error("❌ [TOGGLE STOCK] Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    item.available = !item.available;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("❌ [TOGGLE STOCK ERROR]:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE item
export const deleteMenuItem = async (req, res) => {
  console.log("🔍 [DELETE ITEM] ID:", req.params.id);
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.error("❌ [DELETE ITEM] Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("✅ [DELETE ITEM] Deleted:", deleted);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    console.error("❌ [DELETE ITEM ERROR]:", err);
    res.status(500).json({ message: err.message });
  }
};
