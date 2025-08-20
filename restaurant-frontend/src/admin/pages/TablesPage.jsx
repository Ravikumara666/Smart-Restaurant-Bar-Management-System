// admin/pages/TablesPage.jsx
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { fetchTables, freeTableThunk } from "../features/tables/tablesSlice";
import { Check, X } from "lucide-react";
export default function TablesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.tables);

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const occupied = list.filter((t) => t.status === "occupied");
  const available = list.filter((t) => t.status === "available");

  return (
    <div className="p-6 space-y-6">
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
                <div className="mt-3">
                  <button
                    onClick={() => dispatch(freeTableThunk(t._id))}
                    className="px-3 py-2 rounded-xl bg-green-600 text-white"
                  >
                    <Check size={16} className="inline mr-1" />
                    Free Table
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
              <div className="mt-3">
                <button className="px-3 py-2 rounded-xl bg-gray-200">
                  <X size={16} className="inline mr-1" />
                  Keep Free
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}