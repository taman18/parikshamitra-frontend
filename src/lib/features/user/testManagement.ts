import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUserTests = createAsyncThunk(
  "test/fetchUserTests",
  async ({ accessToken, refreshToken, search }: { accessToken: string; refreshToken: string, search: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/client/test/get-test?search=${search}`,
      {
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

export const deleteTest = createAsyncThunk(
  "test/deleteTest",
  async ({ id, accessToken }: { id: string; accessToken: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/test/delete-test/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  }
)

const initialState = {
  tests: [] as any[],
  loading: false,
  error: null as string | null,
};

export const userSlice = createSlice({
  name: "test",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchUserTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      });
  },
});

export default userSlice.reducer;
