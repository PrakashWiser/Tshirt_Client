import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";

export interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
  level: "parent";
  parentCategory: null;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  level: "sub";
  parentCategory: ParentCategory;
}

export interface ProductVariant {
  color: string;
  size: string;
  price: number;
  salePrice: number;
  sku: string;
  stock: number;
  images: string[];
  isActive: boolean;
  _id: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

interface ProductState {
  items: Product[];
  bestSellerItems: Product[];
  isLoading: boolean;
  isBestSellerLoading: boolean;
  error: string | null;
  bestSellerError: string | null;
}

const initialState: ProductState = {
  items: [],
  bestSellerItems: [],
  isLoading: false,
  isBestSellerLoading: false,
  error: null,
  bestSellerError: null,
};

export const fetchTrendingProducts = createAsyncThunk<
  Product[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("products/fetchTrending", async (_, thunkAPI) => {
  try {
    const response = await FetchApi<ProductsResponse>({
      endpoint: "/products/trending",
    });

    if (!Array.isArray(response.data)) {
      return thunkAPI.rejectWithValue(
        "The products response did not contain a product list",
      );
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to load trending products",
    );
  }
});

export const fetchBestSellerProducts = createAsyncThunk<
  Product[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("products/fetchBestSeller", async (_, thunkAPI) => {
  try {
    const response = await FetchApi<ProductsResponse>({
      endpoint: "/products/best-sellers",
    });

    if (!Array.isArray(response.data)) {
      return thunkAPI.rejectWithValue(
        "The products response did not contain a product list",
      );
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to load best seller products",
    );
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load trending products";
      })

      .addCase(fetchBestSellerProducts.pending, (state) => {
        state.isBestSellerLoading = true;
        state.bestSellerError = null;
      })
      .addCase(fetchBestSellerProducts.fulfilled, (state, action) => {
        state.isBestSellerLoading = false;
        state.bestSellerItems = action.payload;
      })
      .addCase(fetchBestSellerProducts.rejected, (state, action) => {
        state.isBestSellerLoading = false;
        state.bestSellerError =
          action.payload || "Failed to load best seller products";
      });
  },
});

export default productSlice.reducer;
