// admin/pages/OrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentOrders, fetchAllOrders } from "../features/orders/ordersThunks";
import OrderCard from "../components/OrderCard";
import OrderTable from "../components/OrderTable";

const tabs = ["New", "Current", "History"];

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { recent = [], all = [], bill = null, loading = false } = useSelector(
  (s) => s.orders || {}
);

//   const { recent, all, bill, loading } = useSelector((s) => s.orders);
  const [tab, setTab] = useState("New");

useEffect(() => {
  dispatch(fetchRecentOrders()).then((res) => {
    console.log("Recent Orders from API:", res.payload);
  });
  dispatch(fetchAllOrders()).then((res) => {
    console.log("All Orders from API:", res.payload);
  });
}, [dispatch]);


  const filtered = useMemo(() => {
    if (tab === "New"){
      console.log(recent.status)
      return recent.filter((o) => o.status === "Pending"|| o.status==="pending");
    } 
    if (tab === "Current") return all.filter((o) => ["Preparing", "Ready"].includes(o.status));
    return all.filter((o) => ["Served", "Cancelled"].includes(o.status));
  }, [tab, recent, all]);
console.log()
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-xl border ${tab === t ? "bg-gray-900 text-white" : "bg-white"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((o) => (
              <OrderCard key={o._id} order={o} />
              
            )
          )}
          </div>

          <div className="mt-6">
            <OrderTable orders={filtered} />
          </div>
        </>
      )}

    </div>
  );
}