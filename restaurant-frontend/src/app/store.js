// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Frontend
import cartReducer from "../features/cart/cartSlice";

// Admin
import ordersReducer from "../admin/features/orders/ordersSlice";
import tablesReducer from "../admin/features/tables/tablesSlice";
import menuReducer from "../admin/features/menu/menuSlice";
import authReducer from "../admin/features/auth/authSlice";

// Persist only cart
const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    // frontend
    cart: persistedCartReducer,

    // admin
    orders: ordersReducer,
    tables: tablesReducer,
    menu: menuReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);