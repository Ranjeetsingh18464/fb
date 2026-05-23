import { createSlice } from '@reduxjs/toolkit'
const authSlice = createSlice({
  name: 'auth',
  initialState: { loginHistory: [], deviceSessions: [], accountStatus: 'pending' },
  reducers: {
    setLoginHistory: (state, action) => { state.loginHistory = action.payload },
    addLoginRecord: (state, action) => { state.loginHistory.unshift(action.payload) },
    setDeviceSessions: (state, action) => { state.deviceSessions = action.payload },
    setAccountStatus: (state, action) => { state.accountStatus = action.payload }
  }
})
export const { setLoginHistory, addLoginRecord, setDeviceSessions, setAccountStatus } = authSlice.actions
export default authSlice.reducer
