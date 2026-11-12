import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
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

interface CartResult {
  cart: Cart;
  isGuest: boolean;
}

interface AddToCartPayload {
  productId: string;
  size: string;
  color: string;
  quantity?: number;
  product?: Product;
}

interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

interface CartState {
  cart: Cart | null;
  guestCart: Cart;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const emptyGuestCart = (): Cart => ({ user: "guest", items: [] });

const initialState: CartState = {
  cart: null,
  guestCart: emptyGuestCart(),
  isLoading: false,
  isMutating: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const variantKey = (productId: string, size: string, color: string) =>
  `${productId}:${size.toLowerCase()}:${color.toLowerCase()}`;

const getGuestItemPrice = (product: Product, size: string, color: string) => {
  const variant = product.variants.find(
    (item) =>
      item.size.toLowerCase() === size.toLowerCase() &&
      item.color.toLowerCase() === color.toLowerCase(),
  );
  if (!variant) return null;
  if (variant.stock <= 0 || !product.isActive || !variant.isActive) return null;
  return variant.salePrice > 0 ? variant.salePrice : variant.price;
};

export const fetchCart = createAsyncThunk<
  CartResult,
  void,
  { state: RootState; rejectValue: string }
>("cart/fetchCart", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const accessToken = state.auth.accessToken;

  if (!accessToken) {
    return {
      cart: state.cart.guestCart ?? emptyGuestCart(),
      isGuest: true,
    };
  }

  try {
    const response = await FetchApi<CartResponse>({
      endpoint: "/cart",
      token: accessToken,
    });
    return { cart: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to load cart"));
  }
});

export const addToCart = createAsyncThunk<
  CartResult,
  AddToCartPayload,
  { state: RootState; rejectValue: string }
>("cart/addToCart", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  if (!token) {
    const { product, productId, size, color, quantity = 1 } = payload;
    if (!product || product._id !== productId) {
      return thunkAPI.rejectWithValue("Product details are unavailable");
    }

    const price = getGuestItemPrice(product, size, color);
    if (price === null) {
      return thunkAPI.rejectWithValue("This product variant is unavailable");
    }

    const itemKey = variantKey(productId, size, color);
    const guestCart = state.cart.guestCart ?? emptyGuestCart();
    const existing = guestCart.items.find((item) => item._id === itemKey);
    const variant = product.variants.find(
      (item) =>
        item.size.toLowerCase() === size.toLowerCase() &&
        item.color.toLowerCase() === color.toLowerCase(),
    );
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    if (!variant || nextQuantity > variant.stock) {
      return thunkAPI.rejectWithValue("Insufficient stock available");
    }

    const items = existing
      ? guestCart.items.map((item) =>
          item._id === itemKey ? { ...item, quantity: nextQuantity, price } : item,
        )
      : [
          ...guestCart.items,
          {
            _id: itemKey,
            product,
            size,
            color,
            quantity,
            price,
          },
        ];
    return { cart: { ...guestCart, items }, isGuest: true };
  }

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
    return { cart: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to add item to cart"));
  }
});

export const updateCartItem = createAsyncThunk<
  CartResult,
  UpdateCartItemPayload,
  { state: RootState; rejectValue: string }
>("cart/updateCartItem", async ({ itemId, quantity }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  if (!token) {
    const guestCart = state.cart.guestCart ?? emptyGuestCart();
    const item = guestCart.items.find((cartItem) => cartItem._id === itemId);
    if (!item) return thunkAPI.rejectWithValue("Cart item not found");
    const variant = item.product.variants.find(
      (productVariant) =>
        productVariant.size.toLowerCase() === item.size.toLowerCase() &&
        productVariant.color.toLowerCase() === item.color.toLowerCase(),
    );
    if (!variant || quantity > variant.stock) {
      return thunkAPI.rejectWithValue("Insufficient stock available");
    }
    return {
      cart: {
        ...guestCart,
        items: guestCart.items.map((cartItem) =>
          cartItem._id === itemId ? { ...cartItem, quantity } : cartItem,
        ),
      },
      isGuest: true,
    };
  }

  try {
    await FetchApi<CartResponse>({
      endpoint: `/cart/${itemId}`,
      method: "PUT",
      body: { quantity },
      token,
    });
    const response = await FetchApi<CartResponse>({ endpoint: "/cart", token });
    return { cart: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to update cart item"));
  }
});

export const removeCartItem = createAsyncThunk<
  CartResult,
  string,
  { state: RootState; rejectValue: string }
>("cart/removeCartItem", async (itemId, thunkAPI) => {
  const { accessToken } = thunkAPI.getState().auth;
  if (!accessToken) {
    const guestCart = thunkAPI.getState().cart.guestCart ?? emptyGuestCart();
    return {
      cart: {
        ...guestCart,
        items: guestCart.items.filter((item) => item._id !== itemId),
      },
      isGuest: true,
    };
  }

  try {
    await FetchApi<CartResponse>({
      endpoint: `/cart/${itemId}`,
      method: "DELETE",
      token: accessToken,
    });
    const response = await FetchApi<CartResponse>({ endpoint: "/cart", token: accessToken });
    return { cart: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to remove cart item"));
  }
});

export const clearCart = createAsyncThunk<
  CartResult,
  void,
  { state: RootState; rejectValue: string }
>("cart/clearCart", async (_, thunkAPI) => {
  const { accessToken } = thunkAPI.getState().auth;
  if (!accessToken) return { cart: emptyGuestCart(), isGuest: true };

  try {
    await FetchApi<CartResponse>({
      endpoint: "/cart",
      method: "DELETE",
      token: accessToken,
    });
    const response = await FetchApi<CartResponse>({ endpoint: "/cart", token: accessToken });
    return { cart: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to clear cart"));
  }
});

export const mergeGuestCart = createAsyncThunk<
  CartResult,
  void,
  { state: RootState; rejectValue: string }
>("cart/mergeGuestCart", async (_, thunkAPI) => {
  const { accessToken } = thunkAPI.getState().auth;
  if (!accessToken) {
    return thunkAPI.rejectWithValue("Sign in before syncing your cart");
  }

  const guestItems = [...(thunkAPI.getState().cart.guestCart?.items ?? [])];
  try {
    for (const item of guestItems) {
      await FetchApi<CartResponse>({
        endpoint: "/cart",
        method: "POST",
        body: {
          productId: item.product._id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        },
        token: accessToken,
      });
      thunkAPI.dispatch(removeGuestCartItem(item._id));
    }

    const response = await FetchApi<CartResponse>({ endpoint: "/cart", token: accessToken });
    return { cart: response.data, isGuest: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to sync guest cart"));
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeGuestCartItem: (state, action: PayloadAction<string>) => {
      state.guestCart.items = state.guestCart.items.filter(
        (item) => item._id !== action.payload,
      );
    },
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
        if (action.payload.isGuest) state.guestCart = action.payload.cart;
        else state.cart = action.payload.cart;
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
        if (action.payload.isGuest) state.guestCart = action.payload.cart;
        else state.cart = action.payload.cart;
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
        if (action.payload.isGuest) state.guestCart = action.payload.cart;
        else state.cart = action.payload.cart;
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
        if (action.payload.isGuest) state.guestCart = action.payload.cart;
        else state.cart = action.payload.cart;
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
        if (action.payload.isGuest) state.guestCart = action.payload.cart;
        else state.cart = action.payload.cart;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to clear cart";
      })
      .addCase(mergeGuestCart.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.isMutating = false;
        state.cart = action.payload.cart;
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to sync guest cart";
      });
  },
});

export const { removeGuestCartItem, resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
