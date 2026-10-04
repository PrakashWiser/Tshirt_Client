import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";
import { clearTokenRefresh } from "../../utils/setupTokenRefresh";

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  success?: boolean;
  message?: string;
  user?: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthTokenData {
  user?: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

const ACCESS_TOKEN_LIFETIME_MS = 50 * 60 * 1000;

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
};

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  {
    rejectValue: string;
  }
>(
  "auth/loginUser",
  async (payload, thunkAPI) => {
    try {
      const response = await FetchApi<ApiResponse<AuthTokenData>>({
        endpoint: "/auth/login",
        method: "POST",
        body: payload,
        skipAuthHandler: true,
      });

      const accessToken = response.data.accessToken || response.data.token;
      if (!accessToken) {
        return thunkAPI.rejectWithValue(
          "Login response did not include an access token",
        );
      }

      const now = Date.now();
      localStorage.setItem(
        "tokenExpiry",
        String(now + ACCESS_TOKEN_LIFETIME_MS),
      );
      localStorage.setItem("loginTimestamp", String(now));

      return {
        ...response.data,
        accessToken,
        message: response.message,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const refreshToken = createAsyncThunk<
  AuthResponse,
  void,
  {
    state: {
      auth: AuthState;
    };
    rejectValue: string;
  }
>("auth/refreshToken", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const refreshTokenValue = state.auth.refreshToken;
  if (!refreshTokenValue) {
    return thunkAPI.rejectWithValue("No refresh token");
  }

  try {
    const res = await FetchApi<{
      data: { accessToken?: string };
      message: string;
    }>({
      endpoint: "/auth/refresh-token",
      method: "POST",
      token: refreshTokenValue,
      skipAuthHandler: true,
    });
    const accessToken = res.data?.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue(
        "Refresh response did not include an access token",
      );
    }

    localStorage.setItem(
      "tokenExpiry",
      String(Date.now() + ACCESS_TOKEN_LIFETIME_MS),
    );
    return { accessToken, message: res.message };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Session expired"),
    );
  }
});

export const logoutUser = createAsyncThunk<
  string,
  void,
  {
    state: {
      auth: AuthState;
    };
    rejectValue: string;
  }
>("auth/logoutUser", async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.accessToken;

  try {
    if (!token) {
      return "Logged out";
    }

    const response = await FetchApi<ApiResponse<null>>({
      endpoint: "/auth/logout",
      method: "POST",
      token,
      skipAuthHandler: true,
    });

    return response.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Logout failed"));
  } finally {
    thunkAPI.dispatch(logout());
  }
});

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.message = null;
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("loginTimestamp");
      clearTokenRefresh();
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;

        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user || null;
          state.accessToken = action.payload.accessToken || null;
          state.refreshToken = action.payload.refreshToken || null;
          state.isAuthenticated = Boolean(action.payload.accessToken);
          state.message = action.payload.message || "Login successful";
          state.error = null;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload || "Login failed";
      })

      .addCase(
        refreshToken.fulfilled,
        (state, action) => {
          state.accessToken = action.payload?.accessToken || null;
          state.isAuthenticated = Boolean(action.payload?.accessToken);
          state.error = null;
        },
      )
      .addCase(refreshToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.error = action.payload || "Session expired";
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("loginTimestamp");
        clearTokenRefresh();
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
