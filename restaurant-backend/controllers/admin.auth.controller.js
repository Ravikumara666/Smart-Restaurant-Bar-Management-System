import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const adminLogin = (req, res) => {
  const { username, password, role } = req.body;

  // ✅ Hardcoded staff credentials for now
  const users = [
    { username: "admin", password: "123456", role: "admin" },
    { username: "manager", password: "123456", role: "manager" },
    { username: "cashier", password: "123456", role: "cashier" },
    { username: "chef", password: "123456", role: "chef" },
  ];

  const user = users.find(
    (u) =>
      u.username === username && u.password === password && u.role === role
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials or role mismatch",
    });
  }

  // ✅ Generate JWT with role
  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({
    success: true,
    message: "Login successful",
    token,
    role: user.role,
  });
};
