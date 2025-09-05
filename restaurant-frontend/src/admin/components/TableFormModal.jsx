// import React, { useState } from "react";

// export default function TableFormModal({ onClose, onSubmit, editItem }) {
//   const [formData, setFormData] = useState({
//     tableNumber: editItem?.tableNumber || "",
//     capacity: editItem?.capacity || "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <h2 className="text-lg font-bold mb-4">{editItem ? "Edit Table" : "Add Table"}</h2>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="text"
//             name="tableNumber"
//             value={formData.tableNumber}
//             onChange={handleChange}
//             placeholder="Table Number"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <input
//             type="number"
//             name="capacity"
//             value={formData.capacity}
//             onChange={handleChange}
//             placeholder="Capacity"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               {editItem ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Check, X, Plus, Edit, Trash, Users, Clock, MapPin } from "lucide-react";

// Mock data and functions to simulate the Redux functionality
const mockTables = [
  { _id: '1', tableNumber: 'T-01', capacity: 4, status: 'occupied' },
  { _id: '2', tableNumber: 'T-02', capacity: 2, status: 'available' },
  { _id: '3', tableNumber: 'T-03', capacity: 6, status: 'occupied' },
  { _id: '4', tableNumber: 'T-04', capacity: 4, status: 'available' },
  { _id: '5', tableNumber: 'T-05', capacity: 8, status: 'available' },
  { _id: '6', tableNumber: 'T-06', capacity: 2, status: 'occupied' },
];

// TableFormModal Component
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {editItem ? "Edit Table" : "Add New Table"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Table Number</label>
              <input
                type="text"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleChange}
                placeholder="e.g., T-07"
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Number of seats"
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
                min="1"
                max="20"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg"
              >
                {editItem ? "Update" : "Add Table"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
