import React, { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";
import socket from "../utils/socket";

export default function NotificationWrapper() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for new order creation
    socket.on("orderCreated", (order) => {
      console.log("📢 New order received:", order);
      setNotifications((prev) => [
        { type: "created", ...order },
        ...prev
      ]);
      setCount((prev) => prev + 1);
    });

    // Listen for order updates (items added)
    socket.on("orderUpdated", (update) => {
      console.log("📢 Order updated:", update);
      setNotifications((prev) => [
        { type: "updated", ...update },
        ...prev
      ]);
      setCount((prev) => prev + 1);
    });

    return () => {
      socket.off("orderCreated");
      socket.off("orderUpdated");
    };
  }, []);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
    setCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <NotificationBell count={count} onClick={handleClick} />
      {isOpen && notifications.length > 0 && (
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
            {notifications.map((note, index) => (
              <li key={index} className="p-2 text-sm flex justify-between">
                <div>
                  {note.type === "created" ? (
                    <>
                      <strong>New Order:</strong> Table {note.tableNumber} – ₹{note.totalPrice}
                      <br />
                      <span className="text-gray-500">{note.status}</span>
                    </>
                  ) : (
                    <>
                      <strong>Order Updated:</strong> #{note.orderId}
                      <br />
                      <span className="text-gray-500">
                        +{note.addedItemsCount} items | ₹{note.newTotalPrice}
                      </span>
                    </>
                  )}
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    setNotifications((prev) => prev.filter((_, i) => i !== index))
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