import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationBell from "./NotificationBell";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});

export default function NotificationWrapper() {
  const [count, setCount] = useState(0);
  const [newOrders, setNewOrders] = useState([]);

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
    // ✅ Reset count when user clicks
    setCount(0);

    // Optionally show modal or dropdown for details
    console.log("Orders:", newOrders);
  };

  return <NotificationBell count={count} onClick={handleClick} />;
}
