import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";
import type { Product } from "./productSlice";

export interface WishlistItem {
  _id: string;
  user: string;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wishlist {
  items: WishlistItem[];
}

interface WishlistResponse {
  success: boolean;
  message: string;
  data: WishlistItem[];
}

interface WishlistState {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [],
  isLoading: false,
  isMutating: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk<
  WishlistItem[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("wishlist/fetchWishlist", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to load wishlist",
    );
  }
});

export const addToWishlist = createAsyncThunk<
  WishlistItem[],
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("wishlist/addToWishlist", async (productId, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    await FetchApi<WishlistResponse>({
      endpoint: `/wishlist/${productId}`,
      method: "POST",
      token,
    });
    const response = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to add product to wishlist",
    );
  }
});

export const removeFromWishlist = createAsyncThunk<
  WishlistItem[],
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("wishlist/removeFromWishlist", async (productId, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    await FetchApi<WishlistResponse>({
      endpoint: `/wishlist/${productId}`,
      method: "DELETE",
      token,
    });

    const response = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to remove product from wishlist",
    );
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    resetWishlistState: (state) => {
      state.wishlist = [];
      state.isLoading = false;
      state.isMutating = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load wishlist";
      })

      .addCase(addToWishlist.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isMutating = false;
        state.wishlist = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to add product to wishlist";
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isMutating = false;
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isMutating = false;
        state.error =
          action.payload || "Failed to remove product from wishlist";
      });
  },
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
