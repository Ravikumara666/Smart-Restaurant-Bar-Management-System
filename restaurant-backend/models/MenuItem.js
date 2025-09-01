import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    required: true,
enum: [
  "Wine",
  "Whiskey",
  "Beer",
  "Cocktails",
  "Mocktails",
  "Hot Drinks",
  "Cold Drinks",
  "Beverages",
  "Starters",
  "Veg Dishes",
  "Chicken Dishes",
  "Mutton Dishes",
  "Main Course",
  "Desserts"
],
  },
  spiceLevel: { type: Number, default: 0, min: 0, max: 3 },
  discount: { type: Number, default: null },
  price: { type: Number, required: true },
  image: { type: String, default: "" }, // Image URL
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  isVeg: { type: Boolean, default: null }
});

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
export default MenuItem;
