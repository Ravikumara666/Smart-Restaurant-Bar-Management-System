// admin/app/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import ordersReducer from "../features/orders/ordersSlice";
import tablesReducer from "../features/tables/tablesSlice";
import menuReducer from "../features/menu/menuSlice";
import authReducer from "../features/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
  tables: tablesReducer,
  menu: menuReducer,
});

export default rootReducer;