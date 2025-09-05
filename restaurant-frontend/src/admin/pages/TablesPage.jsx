import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { fetchTables, freeTableThunk, addTableThunk, updateTableThunk, deleteTableThunk } from "../features/tables/tablesSlice";
import { Check, X, Plus, Edit, Trash ,Users,MapPin,Clock} from "lucide-react";
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
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
              <p className="text-gray-600 mt-1">Manage your restaurant seating efficiently</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add New Table
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Available Tables</p>
                  <p className="text-2xl font-bold text-green-800">{available.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium">Occupied Tables</p>
                  <p className="text-2xl font-bold text-red-800">{occupied.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Tables</p>
                  <p className="text-2xl font-bold text-blue-800">{list.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Occupied Tables Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-red-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Occupied Tables</h2>
            <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
              {occupied.length} active
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading tables...</span>
            </div>
          ) : occupied.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No occupied tables</p>
              <p className="text-gray-400">All tables are currently available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {occupied.map((table) => (
                <div key={table._id} className="bg-white rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {table.tableNumber.split('-')[1]}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{table.tableNumber}</h3>
                          <div className="flex items-center gap-1 text-sm text-red-600">
                            <Clock size={14} />
                            <span className="font-medium">In use</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6 text-gray-600">
                      <Users size={16} />
                      <span className="font-medium">Seats {table.capacity} guests</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => dispatch(freeTableThunk(table._id))}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        <Check size={16} />
                        Free Up
                      </button>
                      <button
                        onClick={() => handleEdit(table)}
                        className="px-3 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(table._id)}
                        className="px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Tables Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Available Tables</h2>
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
              {available.length} ready
            </span>
          </div>
          
          {available.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <Check className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">All tables are occupied</p>
              <p className="text-gray-400">Great job on the busy day!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {available.map((table) => (
                <div key={table._id} className="bg-white rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {table.tableNumber.split('-')[1]}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{table.tableNumber}</h3>
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <Check size={14} />
                            <span className="font-medium">Available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6 text-gray-600">
                      <Users size={16} />
                      <span className="font-medium">Seats {table.capacity} guests</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(table)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(table._id)}
                        className="px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
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
          message="Are you sure you want to delete this table? This action cannot be undone."
        />
      )}
    </div>
  );
}
