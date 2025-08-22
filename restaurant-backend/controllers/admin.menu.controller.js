import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import MenuItem from "../models/MenuItem.js";

// ✅ GET all menu items
export const getMenu = async (req, res) => {
  console.log("🔍 [GET MENU] Fetching all menu items...");
  try {
    const menu = await MenuItem.find();
    console.log(`✅ [GET MENU] Found ${menu.length} items`);
    res.json(menu);
  } catch (err) {
    console.error("❌ [GET MENU] Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD new menu item
export const addMenuItem = async (req, res) => {
  console.log("🔍 [ADD ITEM] Request received with body:", req.body);
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      console.error("❌ [ADD ITEM] Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = null;
    const imageFile = req.file;

    console.log("📂 [ADD ITEM] File received:", imageFile ? imageFile.filename : "No file");

    // Upload image to Cloudinary if available
    if (imageFile) {
      try {
        const localPath = imageFile.path;
        const publicId = path.parse(imageFile.filename).name;

        console.log(`📤 [CLOUDINARY UPLOAD] Uploading ${localPath} as ${publicId}...`);
        const result = await cloudinary.uploader.upload(localPath, {
          public_id: publicId,
          folder: "menu-items",
        });

        imageUrl = result.secure_url;
        console.log("✅ [CLOUDINARY UPLOAD] Image uploaded:", imageUrl);

        // Delete local file
        fs.unlinkSync(localPath);
        console.log("🗑️ [ADD ITEM] Local file deleted");
      } catch (uploadError) {
        console.error("❌ [CLOUDINARY UPLOAD ERROR]:", uploadError);
        return res.status(500).json({ message: "Image upload failed", success: false });
      }
    }

    // Save menu item with Cloudinary image URL
    console.log("📝 [DB SAVE] Creating new menu item...");
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image: imageUrl || "",
    });

    await menuItem.save();
    console.log("✅ [DB SAVE] New item added:", menuItem);

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
  console.log("🔍 [UPDATE ITEM] ID:", req.params.id);
  console.log("📦 [UPDATE ITEM] Body:", req.body);
  console.log("📂 [UPDATE ITEM] File:", req.file ? req.file.filename : "No file");
  try {
    const { name, description, price, category } = req.body;
    let updateData = { name, description, price, category };

    const imageFile = req.file;
    if (imageFile) {
      try {
        const localPath = imageFile.path;
        const publicId = path.parse(imageFile.filename).name;

        console.log(`📤 [CLOUDINARY UPLOAD] Updating image for item ${req.params.id}...`);
        const result = await cloudinary.uploader.upload(localPath, {
          public_id: publicId,
          folder: "menu-items",
        });

        updateData.image = result.secure_url;
        console.log("✅ [CLOUDINARY UPLOAD] New image URL:", updateData.image);

        fs.unlinkSync(localPath);
        console.log("🗑️ [UPDATE ITEM] Local file deleted");
      } catch (uploadError) {
        console.error("❌ [UPDATE IMAGE UPLOAD ERROR]:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    console.log("📝 [DB UPDATE] Updating item...");
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedItem) {
      console.error("❌ [DB UPDATE] Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("✅ [DB UPDATE] Item updated:", updatedItem);
    res.json(updatedItem);
  } catch (err) {
    console.error("❌ [UPDATE ITEM ERROR]:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ TOGGLE stock
export const toggleStock = async (req, res) => {
  console.log("🔍 [TOGGLE STOCK] ID:", req.params.id);
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      console.error("❌ [TOGGLE STOCK] Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    item.available = !item.available;
    await item.save();

    console.log(`✅ [TOGGLE STOCK] Availability updated: ${item.available}`);
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
