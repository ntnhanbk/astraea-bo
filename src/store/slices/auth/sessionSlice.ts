import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export interface SessionState {
  signedIn: boolean
  access_token: string | null
  refresh_token: string | null
}

const initialState: SessionState = {
  signedIn: false,
  access_token: null,
  refresh_token: null,
}

const sessionSlice = createSlice({
  name: `${SLICE_BASE_NAME}/session`,
  initialState,
  reducers: {
    signInSuccess(
      state,
      action: PayloadAction<Omit<SessionState, 'signedIn'>>
    ) {
      state.signedIn = true
      state.access_token = action.payload.access_token
      state.refresh_token = action.payload.refresh_token
    },
    signOutSuccess(state) {
      state.signedIn = false
      state.access_token = null
      state.refresh_token = null
    },
  },
})

export const { signInSuccess, signOutSuccess } = sessionSlice.actions
export default sessionSlice.reducer
