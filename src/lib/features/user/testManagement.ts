import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUserTests = createAsyncThunk(
  'test/fetchUserTests',
  async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/client/test/get-test`);
    const data = await response.json()
    return data
  }
)

const initialState = {
  tests: [] as any[],
  loading: false,
  error: null as string | null,
}

export const userSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserTests.fulfilled, (state, action) => {
        state.loading = false
        state.tests = action.payload
      })
      .addCase(fetchUserTests.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch users'
      })
  },
})

export default userSlice.reducer
