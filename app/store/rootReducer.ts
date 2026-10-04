import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import bannerReducer from "./slice/bannerSlice";
import parentCategoryReducer from "./slice/parentCategorySlice";
const rootReducer = combineReducers({
  auth: authReducer,
  banners: bannerReducer,
  parentCategories: parentCategoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
