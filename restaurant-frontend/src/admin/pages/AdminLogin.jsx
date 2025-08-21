import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginApi } from "../utils/authApi";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await adminLoginApi({ username, password, role });
      console.log(username)
      if (response.success) {
        localStorage.setItem("adminToken", response.token);
        navigate("/admin/orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-3xl font-bold text-orange-600 mb-6 flex items-center">
        <span className="mr-2">🍽️</span> Smart Dining
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Staff Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <div className="flex items-center border rounded-lg px-3">
              <User className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter your username"
                className="flex-1 px-2 py-2 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock className="text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Enter your password"
                className="flex-1 px-2 py-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Roles */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              {["Admin", "Manager", "Cashier", "Chef"].map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer ${
                    role === r.toLowerCase() ? "border-orange-500" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.toLowerCase()}
                    checked={role === r.toLowerCase()}
                    onChange={() => setRole(r.toLowerCase())}
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-orange-500 font-semibold">
            Continue as Customer
          </a>
        </div>
      </div>
    </div>
  );
}
