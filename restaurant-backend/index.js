import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cloudinary from "cloudinary";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

// Import Routes
import AuthRouter from "./routes/routes.auth.js";
import MenuRouter from "./routes/routes.menu.js";
import OrderRouter from "./routes/routes.orders.js";
import AdminRouter from "./routes/admin.routes.js";

// Connect DB and Cron Jobs
import connectDB from "./config/db.js";
import "./cron/tableResetJob.js";

dotenv.config();

// 🔗 Connect to DB
connectDB();

// ☁️ Cloudinary Config
cloudinary.config({
  cloud_name: "dvsodra8s",
  api_key: "854483971888192",
  api_secret: process.env.Cloudinary_api_secret,
});

// 📦 Express App Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet());

// ✅ Tell Express to trust proxy headers (important for rate-limit real IP detection)
app.set("trust proxy", 1);

// ✅ Global Rate Limiter (for all routes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per 15 mins
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});
app.use(globalLimiter);

// ✅ Login-specific Rate Limiter (Brute force protection)
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Allow 5 login attempts per minute
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// ⛓️ Create HTTP Server for Socket.IO
const server = http.createServer(app);

const allowedOrigins = [
  "https://smart-restaurant-bar-management-sys.vercel.app", // ✅ Your React app domain
  "http://localhost:5173", // ✅ Local dev
];

// 🔌 Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});

// 📣 Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

//  Make io available in all routes/controllers
app.set("io", io);

// ✅ Apply Routes
// Add loginLimiter ONLY to login route for brute-force protection
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", AuthRouter);
app.use("/api/menu", MenuRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/admin", AdminRouter);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 Smart Restaurant & Bar Management System API is running");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});