import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
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

interface WishlistResponse {
  success: boolean;
  message: string;
  data: WishlistItem[];
}

interface WishlistResult {
  items: WishlistItem[];
  isGuest: boolean;
}

interface WishlistState {
  wishlist: WishlistItem[];
  guestWishlist: WishlistItem[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [],
  guestWishlist: [],
  isLoading: false,
  isMutating: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const fetchWishlist = createAsyncThunk<
  WishlistResult,
  void,
  { state: RootState; rejectValue: string }
>("wishlist/fetchWishlist", async (_, thunkAPI) => {
  const { accessToken } = thunkAPI.getState().auth;
  if (!accessToken) {
    return {
      items: thunkAPI.getState().wishlist.guestWishlist,
      isGuest: true,
    };
  }

  try {
    const response = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token: accessToken,
    });
    return { items: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to load wishlist"));
  }
});

export const addToWishlist = createAsyncThunk<
  WishlistResult,
  Product,
  { state: RootState; rejectValue: string }
>("wishlist/addToWishlist", async (product, thunkAPI) => {
  const { accessToken } = thunkAPI.getState().auth;
  if (!accessToken) {
    const guestWishlist = thunkAPI.getState().wishlist.guestWishlist;
    if (guestWishlist.some((item) => item.product._id === product._id)) {
      return { items: guestWishlist, isGuest: true };
    }

    return {
      items: [
        ...guestWishlist,
        { _id: product._id, user: "guest", product },
      ],
      isGuest: true,
    };
  }

  try {
    await FetchApi<WishlistResponse>({
      endpoint: `/wishlist/${product._id}`,
      method: "POST",
      token: accessToken,
    });
    const response = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token: accessToken,
    });
    return { items: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to add product to wishlist"),
    );
  }
});

export const removeFromWishlist = createAsyncThunk<
  WishlistResult,
  string,
  { state: RootState; rejectValue: string }
>("wishlist/removeFromWishlist", async (productId, thunkAPI) => {
  const { accessToken } = thunkAPI.getState().auth;
  if (!accessToken) {
    return {
      items: thunkAPI
        .getState()
        .wishlist.guestWishlist.filter((item) => item.product._id !== productId),
      isGuest: true,
    };
  }

  try {
    await FetchApi<WishlistResponse>({
      endpoint: `/wishlist/${productId}`,
      method: "DELETE",
      token: accessToken,
    });
    const response = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token: accessToken,
    });
    return { items: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to remove product from wishlist"),
    );
  }
});

export const mergeGuestWishlist = createAsyncThunk<
  WishlistResult,
  void,
  { state: RootState; rejectValue: string }
>("wishlist/mergeGuestWishlist", async (_, thunkAPI) => {
  const { accessToken } = thunkAPI.getState().auth;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("Sign in before syncing your favourites");
  }

  try {
    const response = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token: accessToken,
    });
    const existingIds = new Set(
      response.data.map((item) => item.product?._id).filter(Boolean),
    );
    const guestItems = [...thunkAPI.getState().wishlist.guestWishlist];

    for (const item of guestItems) {
      if (!existingIds.has(item.product._id)) {
        await FetchApi<WishlistResponse>({
          endpoint: `/wishlist/${item.product._id}`,
          method: "POST",
          token: accessToken,
        });
      }
      thunkAPI.dispatch(removeGuestWishlistItem(item.product._id));
    }

    const merged = await FetchApi<WishlistResponse>({
      endpoint: "/wishlist",
      token: accessToken,
    });
    return { items: merged.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to sync guest favourites"),
    );
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    removeGuestWishlistItem: (state, action: PayloadAction<string>) => {
      state.guestWishlist = state.guestWishlist.filter(
        (item) => item.product._id !== action.payload,
      );
    },
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
        state.wishlist = action.payload.items;
        if (action.payload.isGuest) state.guestWishlist = action.payload.items;
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
        state.wishlist = action.payload.items;
        if (action.payload.isGuest) state.guestWishlist = action.payload.items;
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
        state.wishlist = action.payload.items;
        if (action.payload.isGuest) state.guestWishlist = action.payload.items;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to remove product from wishlist";
      })
      .addCase(mergeGuestWishlist.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(mergeGuestWishlist.fulfilled, (state, action) => {
        state.isMutating = false;
        state.wishlist = action.payload.items;
      })
      .addCase(mergeGuestWishlist.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to sync guest favourites";
      });
  },
});

export const { removeGuestWishlistItem, resetWishlistState } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
