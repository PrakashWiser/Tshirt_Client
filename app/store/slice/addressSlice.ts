import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";

export interface Address {
  _id: string;
  user: string;
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AddressResponse {
  success: boolean;
  message: string;
  data: Address | Address[];
}

export interface CreateAddressPayload {
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload extends CreateAddressPayload {}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  isMutating: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk<
  Address[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("address/fetchAddresses", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<AddressResponse>({
      endpoint: "/addresses",
      token,
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to load addresses",
    );
  }
});

export const createAddress = createAsyncThunk<
  Address,
  CreateAddressPayload,
  {
    state: RootState;
    rejectValue: string;
  }
>("address/createAddress", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<AddressResponse>({
      endpoint: "/addresses",
      method: "POST",
      body: payload,
      token,
    });

    if (!response.data || Array.isArray(response.data)) {
      throw new Error("Invalid address response");
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to create address",
    );
  }
});

export const updateAddress = createAsyncThunk<
  Address,
  {
    id: string;
    data: UpdateAddressPayload;
  },
  {
    state: RootState;
    rejectValue: string;
  }
>("address/updateAddress", async ({ id, data }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    const response = await FetchApi<AddressResponse>({
      endpoint: `/addresses/${id}`,
      method: "PUT",
      body: data,
      token,
    });

    if (!response.data || Array.isArray(response.data)) {
      throw new Error("Invalid address response");
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to update address",
    );
  }
});

export const deleteAddress = createAsyncThunk<
  string,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("address/deleteAddress", async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.accessToken;

  try {
    await FetchApi<AddressResponse>({
      endpoint: `/addresses/${id}`,
      method: "DELETE",
      token,
    });

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete address",
    );
  }
});

const addressSlice = createSlice({
  name: "address",
  initialState,

  reducers: {
    resetAddressState: (state) => {
      state.addresses = [];
      state.isLoading = false;
      state.isMutating = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
      })

      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load addresses";
      })

      .addCase(createAddress.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.isMutating = false;
        state.addresses.unshift(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to create address";
      })

      .addCase(updateAddress.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isMutating = false;
        const index = state.addresses.findIndex(
          (address) => address._id === action.payload._id,
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to update address";
      })

      .addCase(deleteAddress.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isMutating = false;
        state.addresses = state.addresses.filter(
          (address) => address._id !== action.payload,
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to delete address";
      });
  },
});

export const { resetAddressState } = addressSlice.actions;

export default addressSlice.reducer;
