import { API_URIS } from '@/lib/constant';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string;
  refreshToken: string;
}

const initialState: AuthState = {
  accessToken: '',
  refreshToken: '',
};

export const signUp = createAsyncThunk(
  "auth/signUpUser",
  async ({ email, userName, password }: { email: string; userName: string; password: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.auth.register}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userName, password }),
      }
    );
    const data = await response.json();
    return data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async ({ accessToken }: { accessToken: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.auth.logout}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
