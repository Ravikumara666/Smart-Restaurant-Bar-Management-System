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

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

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

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((m) => (
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
