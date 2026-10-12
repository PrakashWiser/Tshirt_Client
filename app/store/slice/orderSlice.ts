import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";

export type PaymentMethod = "cod" | "razorpay";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  _id?: string;
  product: string;
  variant?: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      };

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  subtotal: number;
  discount: number;
  shippingCharge: number;
  totalAmount: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order | Order[];
}

export interface CreateOrderPayload {
  shippingAddressId: string;
  paymentMethod?: PaymentMethod;

  items?: {
    product: string;
    size: string;
    color: string;
    quantity: number;
  }[];
}

interface OrderState {
  orders: Order[];
  order: Order | null;

  isLoading: boolean;
  isMutating: boolean;

  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  order: null,

  isLoading: false,
  isMutating: false,

  error: null,
};

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  {
    state: RootState;
    rejectValue: string;
  }
>("order/createOrder", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<OrderResponse>({
      endpoint: "/orders",
      method: "POST",
      body: payload,
      token,
    });

    if (!response.data || Array.isArray(response.data)) {
      throw new Error("Invalid order response");
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to create order",
    );
  }
});

/* =========================
   GET ORDERS
========================= */

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("order/fetchOrders", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<OrderResponse>({
      endpoint: "/orders",
      token,
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to load orders",
    );
  }
});

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("order/fetchOrderById", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<OrderResponse>({
      endpoint: `/orders/${id}`,
      token,
    });

    if (!response.data || Array.isArray(response.data)) {
      throw new Error("Invalid order response");
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to load order",
    );
  }
});

export const cancelOrder = createAsyncThunk<
  Order,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("order/cancelOrder", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<OrderResponse>({
      endpoint: `/orders/${id}/cancel`,
      method: "PUT",
      token,
    });

    if (!response.data || Array.isArray(response.data)) {
      throw new Error("Invalid order response");
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to cancel order",
    );
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    resetOrderState: (state) => {
      state.orders = [];
      state.order = null;
      state.isLoading = false;
      state.isMutating = false;
      state.error = null;
    },

    clearCurrentOrder: (state) => {
      state.order = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isMutating = false;
        state.order = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to create order";
      })

      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load orders";
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load order";
      })

      .addCase(cancelOrder.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isMutating = false;
        state.order = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to cancel order";
      });
  },
});

export const { resetOrderState, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
