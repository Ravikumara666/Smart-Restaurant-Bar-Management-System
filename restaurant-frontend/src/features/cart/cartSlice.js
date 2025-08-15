// import { createSlice } from "@reduxjs/toolkit";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       const existing = state.items.find(item => item._id === action.payload._id);
//       if (existing) {
//         existing.quantity += 1;
//       } else {
//         state.items.push({ ...action.payload, quantity: 1 });
//       }
//     },
//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(item => item._id !== action.payload);
//     },
//     updateQuantity: (state, action) => {
//       const { id, quantity } = action.payload;
//       const item = state.items.find(item => item._id === id);
//       if (item) {
//         item.quantity = quantity;
//       }
//     },
//     clearCart: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  tableNumber: "",
  notes: "",
  paymentMethod: "Cash"
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    setTableNumber: (state, action) => {
      state.tableNumber = action.payload;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCart: () => initialState
  }
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  setTableNumber,
  setNotes,
  setPaymentMethod,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;