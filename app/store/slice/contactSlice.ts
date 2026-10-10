import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import type { RootState } from "../store";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateContactPayload {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

interface ContactState {
  contact: Contact | null;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ContactState = {
  contact: null,
  isSubmitting: false,
  error: null,
  success: false,
};

export const createContact = createAsyncThunk<
  Contact,
  CreateContactPayload,
  {
    state: RootState;
    rejectValue: string;
  }
>("contact/createContact", async (payload, thunkAPI) => {
  try {
    const response = await FetchApi<ContactResponse>({
      endpoint: "/contact",
      method: "POST",
      body: payload,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to submit enquiry",
    );
  }
});

const contactSlice = createSlice({
  name: "contact",
  initialState,

  reducers: {
    resetContactState: (state) => {
      state.contact = null;
      state.isSubmitting = false;
      state.error = null;
      state.success = false;
    },

    clearContactError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createContact.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createContact.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.contact = action.payload;
        state.success = true;
        state.error = null;
      })

      .addCase(createContact.rejected, (state, action) => {
        state.isSubmitting = false;
        state.success = false;
        state.error = action.payload || "Failed to submit enquiry";
      });
  },
});

export const { resetContactState, clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
