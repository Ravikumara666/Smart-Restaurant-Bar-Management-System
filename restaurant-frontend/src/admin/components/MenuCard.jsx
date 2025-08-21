import React, { useState } from "react";

export default function MenuCard({ item, onEdit, onToggle, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(item._id);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between relative">
      <img
        src={item.image || "https://via.placeholder.com/150"}
        alt={item.name}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <span className="text-xl font-bold text-orange-500">₹{item.price}</span>
      </div>

      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
      <p className="text-gray-500 text-xs">Category: {item.category}</p>
      <p className="text-gray-500 text-xs">
        Spice Level: {item.spiceLevel} | {item.isVeg ? "Veg" : "Non-Veg"}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t">
        <span
          className={`text-sm font-medium ${
            item.available ? "text-green-600" : "text-red-500"
          }`}
        >
          {item.available ? "In Stock" : "Out of Stock"}
        </span>
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={item.available}
            onChange={onToggle}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
        </label>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-yellow-500 text-white rounded flex-1"
        >
          Edit
        </button>
        <button
          onClick={handleDeleteClick}
          className="px-4 py-2 bg-red-500 text-white rounded flex-1"
        >
          Delete
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <strong>{item.name}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
