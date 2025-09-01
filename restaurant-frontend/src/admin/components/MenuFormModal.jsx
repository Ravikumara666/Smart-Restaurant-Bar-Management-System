import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addMenuItem, updateMenuItem } from "../features/menu/menuSlice";
import { getCatogeries } from "../../utils/menuApi";


export default function MenuFormModal({ onClose, editItem }) {
  const dispatch = useDispatch();
  const [categories,setCategories]=useState([])

 useEffect(() => {
    (async () => {
      try {

        const categoriesAPI= await getCatogeries()
        console.log(categoriesAPI)
        setCategories(categoriesAPI);
        console.log("set the category")
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    })();
  }, []);

  const [formData, setFormData] = useState({
    name: editItem?.name || "",
    description: editItem?.description || "",
    price: editItem?.price || "",
    category: editItem?.category || "",
    spiceLevel: editItem?.spiceLevel || 0,
    isVeg: editItem?.isVeg===true,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  Object.keys(formData).forEach((key) => {
    if (formData[key] !== null) {
if (key === "isVeg") {
  data.append(key, formData[key] ? "true" : "false"); // Convert to string
} else {
  data.append(key, formData[key]);
}
    }
  });

  if (editItem) {
-   dispatch(updateMenuItem({ id: editItem._id, data }));
+   dispatch(updateMenuItem({ id: editItem._id, formData: data }));
  } else {
    dispatch(addMenuItem(data));
  }

  onClose();
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {editItem ? "Edit Menu Item" : "Add Menu Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
            required
          ></textarea>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className="block">Spice Level (0-3)</label>
          <input
            type="number"
            name="spiceLevel"
            min="0"
            max="3"
            value={formData.spiceLevel}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isVeg"
              checked={formData.isVeg}
              onChange={handleChange}
            />
            Is Veg?
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
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
