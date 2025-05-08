import { API_URIS } from '@/lib/constant';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchTilesInfo = createAsyncThunk(
  'dashboard/fetchTilesInfo',
  async ({accessToken, range}: {accessToken: string, range: string}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.dashboard.getTilesInfo}?range=${range}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json()
    return data
  }
)

const initialState = {
  tiles: {
    totalUsers: 0,
    totalTestTaken: 0,
    averageScore: 0,
  },
  loading: false,
  error: null as string | null,
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTilesInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTilesInfo.fulfilled, (state, action) => {
        state.loading = false
        state.tiles = action.payload
      })
      .addCase(fetchTilesInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch users'
      })
  },
})

export default dashboardSlice.reducer
