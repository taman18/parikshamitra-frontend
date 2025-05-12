import { API_URIS } from '@/lib/constant';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk(
  'users/fetchByIdStatus',
  async ({search, accessToken, limit = 10, pageNo = 1}: {search: string, accessToken: string, limit: number, pageNo: number}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/${API_URIS.users.getAllUsers}?search=${search}&limit=${limit}&pageNo=${pageNo}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.response.data
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

interface User {
  _id: string;
  userName: string;
  email: string;
  status: string;
  testTaken: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


interface UserInfo {
  getUsers: {
    users: User[]
    loading: boolean
    error: string | null
    totalUsers: number
    totalPages: number
  }
  updateStatus: {
    loading: boolean
    error: string | null
  }
}

const initialState: UserInfo = {
  getUsers: {
    users: [],
    loading: false,
    error: null as string | null,
    totalUsers: 0,
    totalPages: 0
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
        state.getUsers = action.payload
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
