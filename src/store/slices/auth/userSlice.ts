import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export enum ChainEnum {
  POLYGON = 'Polygon',
  CRONOS = 'Cronos',
}

export type UserState = {
  avatar?: string
  username?: string
  authority?: string[]
  id?: string
  deletedAt?: any
  deletedBy?: any
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
  wallet?: {
    connected: boolean
    chain?: ChainEnum
  }
}

const initialState: UserState = {
  avatar: '',
  username: '',
  authority: [],
  id: '',
  wallet: {
    connected: false,
  },
}

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.avatar = action.payload?.avatar
      state.username = action.payload?.username
      state.authority = action.payload?.authority
    },
    setWallet(state, action: PayloadAction<UserState['wallet']>) {
      state.wallet = action.payload
    },
  },
})

export const { setUser, setWallet } = userSlice.actions
export default userSlice.reducer
