import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";
import type { Product } from "./productSlice";

export interface CartItem {
  _id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

interface AddToCartPayload {
  productId: string;
  size: string;
  color: string;
  quantity?: number;
}

interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  isMutating: false,
  error: null,
};

export const fetchCart = createAsyncThunk<
  Cart,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("cart/fetchCart", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<CartResponse>({
      endpoint: "/cart",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to load cart",
    );
  }
});

export const addToCart = createAsyncThunk<
  Cart,
  AddToCartPayload,
  {
    state: RootState;
    rejectValue: string;
  }
>("cart/addToCart", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    await FetchApi<CartResponse>({
      endpoint: "/cart",
      method: "POST",
      body: payload,
      token,
    });

    const response = await FetchApi<CartResponse>({
      endpoint: "/cart",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to add item to cart",
    );
  }
});

export const updateCartItem = createAsyncThunk<
  Cart,
  UpdateCartItemPayload,
  {
    state: RootState;
    rejectValue: string;
  }
>("cart/updateCartItem", async ({ itemId, quantity }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    await FetchApi<CartResponse>({
      endpoint: `/cart/${itemId}`,
      method: "PUT",
      body: {
        quantity,
      },
      token,
    });

    const response = await FetchApi<CartResponse>({
      endpoint: "/cart",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to update cart item",
    );
  }
});

export const removeCartItem = createAsyncThunk<
  Cart,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("cart/removeCartItem", async (itemId, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    await FetchApi<CartResponse>({
      endpoint: `/cart/${itemId}`,
      method: "DELETE",
      token,
    });

    const response = await FetchApi<CartResponse>({
      endpoint: "/cart",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to remove cart item",
    );
  }
});

export const clearCart = createAsyncThunk<
  Cart,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("cart/clearCart", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    await FetchApi<CartResponse>({
      endpoint: "/cart",
      method: "DELETE",
      token,
    });

    const response = await FetchApi<CartResponse>({
      endpoint: "/cart",
      token,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to clear cart",
    );
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.isLoading = false;
      state.isMutating = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load cart";
      })

      .addCase(addToCart.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.isMutating = false;
        state.cart = action.payload;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to add item to cart";
      })

      .addCase(updateCartItem.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isMutating = false;
        state.cart = action.payload;
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to update cart item";
      })

      .addCase(removeCartItem.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.isMutating = false;
        state.cart = action.payload;
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to remove cart item";
      })

      .addCase(clearCart.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(clearCart.fulfilled, (state, action) => {
        state.isMutating = false;
        state.cart = action.payload;
      })

      .addCase(clearCart.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;
