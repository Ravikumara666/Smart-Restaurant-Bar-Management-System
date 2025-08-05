// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cloudinary from "cloudinary";

// Import Routes
import AuthRouter from "./routes/routes.auth.js";
import MenuRouter from "./routes/routes.menu.js";
import OrderRouter from "./routes/routes.orders.js";
import TableRouter from "./routes/routes.tables.js";
import './cron/tableResetJob.js'
import AdminRouter from "./routes/admin.routes.js";




dotenv.config();


cloudinary.config({
  cloud_name: 'dvsodra8s',
  api_key: '854483971888192',
  api_secret: process.env.Cloudinary_api_secret,
});

const app = express();
// Middleware

app.use(cors());
app.use(express.json()); // For parsing JSON
// Use Routes
app.use("/api/auth", AuthRouter);
app.use("/api/menu", MenuRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/tables", TableRouter);
app.use("/api/admin",AdminRouter );


const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection failed:", err));

// Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 Smart Restaurant & Bar Management System API is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
