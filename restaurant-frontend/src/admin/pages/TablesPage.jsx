import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { fetchTables, freeTableThunk, addTableThunk, updateTableThunk, deleteTableThunk } from "../features/tables/tablesSlice";
import { Check, X, Plus, Edit, Trash } from "lucide-react";
import TableFormModal from "../components/TableFormModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function TablesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.tables);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const occupied = list.filter((t) => t.status === "occupied");
  const available = list.filter((t) => t.status === "available");

  const handleAdd = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const handleSubmit = (data) => {
    if (editItem) {
      dispatch(updateTableThunk({ id: editItem._id, data }));
    } else {
      dispatch(addTableThunk(data));
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    dispatch(deleteTableThunk(deleteId));
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tables</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Table
        </button>
      </div>

      <section>
        <h2 className="font-semibold mb-3">Occupied</h2>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {occupied.map((t) => (
              <div key={t._id} className="border rounded-2xl p-4 bg-white">
                <div className="font-semibold">{t.tableNumber}</div>
                <div className="text-sm text-gray-500">Capacity: {t.capacity}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => dispatch(freeTableThunk(t._id))}
                    className="px-3 py-2 rounded-xl bg-green-600 text-white"
                  >
                    <Check size={16} className="inline mr-1" /> Free
                  </button>
                  <button
                    onClick={() => handleEdit(t)}
                    className="px-3 py-2 rounded-xl bg-yellow-500 text-white"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="px-3 py-2 rounded-xl bg-red-500 text-white"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-3">Available</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {available.map((t) => (
            <div key={t._id} className="border rounded-2xl p-4 bg-white">
              <div className="font-semibold">{t.tableNumber}</div>
              <div className="text-sm text-gray-500">Capacity: {t.capacity}</div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="px-3 py-2 rounded-xl bg-yellow-500 text-white"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="px-3 py-2 rounded-xl bg-red-500 text-white"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <TableFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          editItem={editItem}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this table?"
        />
      )}
    </div>
  );
}
