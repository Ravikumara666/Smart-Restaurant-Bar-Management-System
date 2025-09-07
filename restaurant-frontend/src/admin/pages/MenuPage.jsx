import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMenuItem, fetchMenu, toggleStock } from "../features/menu/menuSlice";
import MenuCard from "../components/MenuCard";
import MenuFormModal from "../components/MenuFormModal";

export default function MenuPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.menu);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const categories = Array.from(new Set(list.map(item => item.category).filter(Boolean)));

  const filteredList = list.filter(item => {
    const matchesName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesName && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-xl">Menu</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => {
            setEditItem(null);
            setShowModal(true);
          }}
        >
          + Add Item
        </button>
      </div>

      <div className="flex mb-6 space-x-4">
        <input
          type="text"
          placeholder="Search items..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredList.map((m) => (
            <MenuCard
              key={m._id}
              item={m}
              onEdit={() => {
                setEditItem(m);
                setShowModal(true);
              }}
              onToggle={() => dispatch(toggleStock(m._id))}
              onDelete={(id) => dispatch(deleteMenuItem(id))}
            />
          ))}
        </div>
      )}

      {showModal && (
        <MenuFormModal
          onClose={() => setShowModal(false)}
          editItem={editItem}
        />
      )}
    </div>
  );
}
