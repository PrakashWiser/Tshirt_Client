import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthView = "login" | "register";

interface AuthModalState {
  isOpen: boolean;
  initialView: AuthView;
}

const initialState: AuthModalState = {
  isOpen: false,
  initialView: "login",
};

const authModalSlice = createSlice({
  name: "authModal",

  initialState,

  reducers: {
    openAuthModal: (state, action: PayloadAction<AuthView | undefined>) => {
      state.isOpen = true;
      state.initialView = action.payload || "login";
    },

    closeAuthModal: (state) => {
      state.isOpen = false;
      state.initialView = "login";
    },

    openLoginModal: (state) => {
      state.isOpen = true;
      state.initialView = "login";
    },

    openRegisterModal: (state) => {
      state.isOpen = true;
      state.initialView = "register";
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  openLoginModal,
  openRegisterModal,
} = authModalSlice.actions;

export default authModalSlice.reducer;
