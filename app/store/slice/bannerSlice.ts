import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  sortOrder: number;
}

interface BannerState {
  items: Banner[];
  isLoading: boolean;
  error: string | null;
}

interface BannersResponse {
  success: boolean;
  message: string;
  data: Banner[];
}

const initialState: BannerState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchActiveBanners = createAsyncThunk<
  Banner[],
  void,
  { state: RootState; rejectValue: string }
>(
  "banners/fetchActive",
  async (_, thunkAPI) => {
    try {
      const response = await FetchApi<BannersResponse>({
        endpoint: "/banners",
        skipAuthHandler: true,
      });

      if (!Array.isArray(response.data)) {
        return thunkAPI.rejectWithValue(
          "The banners response did not contain a banner list",
        );
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Failed to load banners",
      );
    }
  },
  {
    condition: (_, { getState }) => !getState().banners.isLoading,
  },
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveBanners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchActiveBanners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load banners";
      });
  },
});

export default bannerSlice.reducer;
