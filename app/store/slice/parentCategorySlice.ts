import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";

export interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface ParentCategoriesResponse {
  success: boolean;
  message: string;
  data: ParentCategory[];
}

interface ParentCategoryState {
  items: ParentCategory[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ParentCategoryState = {
  items: [],
  isLoading: false,
  error: null,
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
      });
  },
});

export default parentCategorySlice.reducer;
