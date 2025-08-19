// admin/pages/MenuPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu, toggleStock } from "../features/menu/menuSlice";

export default function MenuPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.menu);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="font-semibold text-xl mb-6">Menu</h2>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 flex-1 pr-2">
                  {m.name}
                </h3>
                <div className="text-right">
                  <span className="text-xl font-bold text-orange-500">
                    ₹{m.price}
                  </span>
                  {m.originalPrice && m.originalPrice > m.price && (
                    <span className="block text-sm text-gray-400 line-through">
                      ₹{m.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {m.description}
              </p>

              {/* Stock toggle */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t">
                <span
                  className={`text-sm font-medium ${
                    m.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {m.available ? "In Stock" : "Out of Stock"}
                </span>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={m.available}
                    onChange={() => dispatch(toggleStock(m._id))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}