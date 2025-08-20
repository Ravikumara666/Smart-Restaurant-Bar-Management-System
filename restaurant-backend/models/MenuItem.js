import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    required: true,
    enum: [
      "Hot Drinks",
      "Cold Drinks",
      "Chicken Dishes",
      "Mutton Dishes",
      "Veg Dishes",
      "Starters",
      "Main Course",
      "Desserts",
      "Beverages"
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
