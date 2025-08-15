import { combineReducers } from "redux";
import cartReducer from "../features/cart/cartSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;