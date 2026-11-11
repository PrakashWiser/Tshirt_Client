import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";

export interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CategoryMenuItem {
  _id: string;
  name: string;
  slug: string;
  parentCategory: Pick<ParentCategory, "_id" | "name" | "slug"> | null;
}

interface ParentCategoriesResponse {
  success: boolean;
  message: string;
  data: ParentCategory[];
}

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: CategoryMenuItem[];
}

interface ParentCategoryState {
  items: ParentCategory[];
  categories: CategoryMenuItem[];
  isLoading: boolean;
  error: string | null;
  isCategoriesLoading: boolean;
  categoriesError: string | null;
}

const initialState: ParentCategoryState = {
  items: [],
  categories: [],
  isLoading: false,
  error: null,
  isCategoriesLoading: false,
  categoriesError: null,
};

export const fetchParentCategories = createAsyncThunk<
  ParentCategory[],
  void,
  { state: RootState; rejectValue: string }
>(
  "parentCategories/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await FetchApi<ParentCategoriesResponse>({
        endpoint: "/parent-categories/public",
        skipAuthHandler: true,
      });

      if (!Array.isArray(response.data)) {
        return thunkAPI.rejectWithValue(
          "The parent categories response did not contain a category list",
        );
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to load parent categories",
      );
    }
  },
  {
    condition: (_, { getState }) => !getState().parentCategories.isLoading,
  },
);

export const fetchCategories = createAsyncThunk<
  CategoryMenuItem[],
  void,
  { state: RootState; rejectValue: string }
>(
  "parentCategories/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await FetchApi<CategoriesResponse>({
        endpoint: "/categories",
        skipAuthHandler: true,
      });

      if (!Array.isArray(response.data)) {
        return thunkAPI.rejectWithValue(
          "The categories response did not contain a category list",
        );
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Failed to load categories",
      );
    }
  },
  {
    condition: (_, { getState }) => !getState().parentCategories.isCategoriesLoading,
  },
);

const parentCategorySlice = createSlice({
  name: "parentCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParentCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchParentCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load parent categories";
      })
      .addCase(fetchCategories.pending, (state) => {
        state.isCategoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isCategoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isCategoriesLoading = false;
        state.categoriesError = action.payload || "Failed to load categories";
      });
  },
});

export default parentCategorySlice.reducer;
