import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import bannerReducer from "./slice/bannerSlice";
import parentCategoryReducer from "./slice/parentCategorySlice";
import productReducer from "./slice/productSlice";
import cartReducer from "./slice/cartSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  banners: bannerReducer,
  parentCategories: parentCategoryReducer,
  products: productReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
