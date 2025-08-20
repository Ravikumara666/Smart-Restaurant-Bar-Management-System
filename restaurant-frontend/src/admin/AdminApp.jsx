// // admin/AdminApp.jsx
// import { Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";
// import DashboardPage from "./pages/DashboardPage";
// import OrdersPage from "./pages/OrdersPage";
// import TablesPage from "./pages/TablesPage";
// import MenuPage from "./pages/MenuPage";
// import SalesPage from "./pages/SalesPage";

// export default function AdminApp() {
//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Header />
//         <main className="flex-1">
//           <Routes>
//             <Route path="/dashboard" element={<DashboardPage />} />
//             <Route path="orders" element={<OrdersPage />} />
//             <Route path="tables" element={<TablesPage />} />
//             <Route path="menu" element={<MenuPage />} />
//             <Route path="sales" element={<SalesPage />} />
//             <Route path="*" element={<Navigate to="/admin" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }