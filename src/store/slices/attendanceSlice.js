import { createSlice } from '@reduxjs/toolkit'
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { records: [], stats: null, loading: false },
  reducers: {
    setRecords: (state, action) => { state.records = action.payload },
    setStats: (state, action) => { state.stats = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setRecords, setStats, setLoading } = attendanceSlice.actions
export default attendanceSlice.reducer
