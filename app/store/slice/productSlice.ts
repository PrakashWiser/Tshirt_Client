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
  level: "sub" | "child" | "parent";
  parentCategory: ParentCategory | null;
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

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: "asc" | "desc";
  bestSeller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
  trending?: boolean;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination: ProductPagination;
  };
}

interface SimpleProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

interface SingleProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductState {
  items: Product[];
  pagination: ProductPagination;
  bestSellerItems: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  isCurrentLoading: boolean;
  isBestSellerLoading: boolean;
  error: string | null;
  currentError: string | null;
  bestSellerError: string | null;
}

const initialState: ProductState = {
  items: [],
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  bestSellerItems: [],
  currentProduct: null,
  isLoading: false,
  isCurrentLoading: false,
  isBestSellerLoading: false,
  error: null,
  currentError: null,
  bestSellerError: null,
};

export const fetchProducts = createAsyncThunk<
  {
    products: Product[];
    pagination: ProductPagination;
  },
  ProductFilterParams | undefined,
  {
    state: RootState;
    rejectValue: string;
  }
>("products/fetchProducts", async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set("page", String(params.page));
    if (params.limit) queryParams.set("limit", String(params.limit));
    if (params.search) queryParams.set("search", params.search);
    if (params.category) queryParams.set("category", params.category);
    if (params.size) queryParams.set("size", params.size);
    if (params.color) queryParams.set("color", params.color);
    if (params.minPrice !== undefined)
      queryParams.set("minPrice", String(params.minPrice));
    if (params.maxPrice !== undefined)
      queryParams.set("maxPrice", String(params.maxPrice));
    if (params.sort) queryParams.set("sort", params.sort);
    if (params.order) queryParams.set("order", params.order);
    if (params.bestSeller !== undefined)
      queryParams.set("bestSeller", String(params.bestSeller));
    if (params.newArrival !== undefined)
      queryParams.set("newArrival", String(params.newArrival));
    if (params.featured !== undefined)
      queryParams.set("featured", String(params.featured));
    if (params.trending !== undefined)
      queryParams.set("trending", String(params.trending));

    const query = queryParams.toString();

    const response = await FetchApi<ProductsResponse>({
      endpoint: `/products${query ? `?${query}` : ""}`,
    });

    if (!response.data || !Array.isArray(response.data.products)) {
      return thunkAPI.rejectWithValue(
        "The products response did not contain a product list",
      );
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to load products",
    );
  }
});

export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("products/fetchProductBySlug", async (slug, thunkAPI) => {
  try {
    const response = await FetchApi<SingleProductResponse>({
      endpoint: `/products/${slug}`,
    });

    if (!response.data) {
      return thunkAPI.rejectWithValue("Product not found");
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to load product",
    );
  }
});

export const fetchTrendingProducts = createAsyncThunk<
  Product[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("products/fetchTrending", async (_, thunkAPI) => {
  try {
    const response = await FetchApi<SimpleProductsResponse>({
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
    const response = await FetchApi<SimpleProductsResponse>({
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
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load products";
      })

      .addCase(fetchProductBySlug.pending, (state) => {
        state.isCurrentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isCurrentLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isCurrentLoading = false;
        state.currentError = action.payload || "Failed to load product";
      })

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

export const { clearCurrentProduct } = productSlice.actions;

export default productSlice.reducer;
