import { API_URIS } from '@/lib/constant';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk(
  'users/fetchByIdStatus',
  async ({search, accessToken}: {search: string, accessToken: string}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.users.getAllUsers}?search=${search}`,
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

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ id, status, accessToken }: { id: string; status: string, accessToken: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.users.updateUserStatus}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    })
    const data = await response.json()
    return data
  }
)

const initialState = {
  getUsers: {
    users: [],
    loading: false,
    error: null as string | null,
  },
  updateStatus: {
    loading: false,
    error: null as string | null
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.getUsers.loading = true
        state.getUsers.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.getUsers.loading = false
        state.getUsers.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.getUsers.loading = false
        state.getUsers.error = action.error.message ?? 'Failed to fetch users'
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.updateStatus.loading = true
        state.updateStatus.error = null
      })
      .addCase(updateUserStatus.fulfilled, (state) => {
        state.updateStatus.loading = false
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.updateStatus.loading = false
        state.updateStatus.error = action.error.message ?? 'Failed to update user status'
      })
  },
})

export default userSlice.reducer
