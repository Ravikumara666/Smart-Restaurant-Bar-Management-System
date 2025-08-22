import React, { useState } from "react";

export default function TableFormModal({ onClose, onSubmit, editItem }) {
  const [formData, setFormData] = useState({
    tableNumber: editItem?.tableNumber || "",
    capacity: editItem?.capacity || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">{editItem ? "Edit Table" : "Add Table"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="tableNumber"
            value={formData.tableNumber}
            onChange={handleChange}
            placeholder="Table Number"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editItem ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
