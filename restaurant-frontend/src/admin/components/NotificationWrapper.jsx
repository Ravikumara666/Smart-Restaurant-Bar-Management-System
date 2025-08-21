import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationBell from "./NotificationBell";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});

export default function NotificationWrapper() {
  const [count, setCount] = useState(0);
  const [newOrders, setNewOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Toggle dropdown

  useEffect(() => {
    // ✅ Listen for newOrder event from backend
    socket.on("newOrder", (order) => {
      console.log("📢 New order received:", order);
      setNewOrders((prev) => [order, ...prev]);
      setCount((prev) => prev + 1);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  const handleClick = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown
    setCount(0);
  };

  const clearNotifications = () => {
    setNewOrders([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <NotificationBell count={count} onClick={handleClick} />
      {isOpen && newOrders.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg border rounded-lg z-50">
          <div className="flex justify-between items-center p-2 border-b">
            <span className="font-semibold">Notifications</span>
            <button
              onClick={clearNotifications}
              className="text-red-500 text-sm hover:underline"
            >
              Clear All
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
            {newOrders.map((order, index) => (
              <li key={index} className="p-2 text-sm flex justify-between">
                <div>
                  <strong>{order.tableNumber}</strong> – ₹{order.totalPrice}
                  <br />
                  <span className="text-gray-500">{order.status}</span>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    setNewOrders((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
