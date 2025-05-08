import { TestState } from "@/common/interface";
import { API_URIS } from "@/lib/constant";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchUserTests = createAsyncThunk(
  "test/fetchUserTests",
  async ({ accessToken, search, limit = 10 }: { accessToken: string, search: string, limit?: number }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.tests.getTests}?search=${search}&limit=${limit}`,
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.tests.deleteTest}/${id}`, {
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

export const getTestsByUserId = createAsyncThunk(
  "test/getTestsByUserId",
  async ({ id, accessToken }: { id: string; accessToken: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.tests.getTestsInfoByUserId}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  }
)

const initialState: TestState = {
  testsListing: [],
  totalTests: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setUpdatedTests: (state, action: PayloadAction<TestState>) => {
      state.testsListing = action.payload.testsListing.filter(
        (test) => !state.testsListing.find((t) => t._id === test._id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTests.fulfilled, (state, action) => {
        state.loading = false;
        const { tests } = action.payload;
        state.testsListing = tests.formattedTests;
        state.totalTests = tests.totalTests;
        state.totalPages = tests.totalPages;
      })
      .addCase(fetchUserTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch tests";
      });
  },
});

export const { setUpdatedTests } = testSlice.actions;
export default testSlice.reducer;
