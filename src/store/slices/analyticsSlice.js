import { createSlice } from '@reduxjs/toolkit'

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { userActivity: [], homeworkCompletion: [], attendanceTrends: [], performanceData: [], groupEngagement: [], revenue: [], appUsage: [], loading: false },
  reducers: {
    setUserActivity: (state, action) => { state.userActivity = action.payload },
    setHomeworkCompletion: (state, action) => { state.homeworkCompletion = action.payload },
    setAttendanceTrends: (state, action) => { state.attendanceTrends = action.payload },
    setPerformanceData: (state, action) => { state.performanceData = action.payload },
    setGroupEngagement: (state, action) => { state.groupEngagement = action.payload },
    setRevenue: (state, action) => { state.revenue = action.payload },
    setAppUsage: (state, action) => { state.appUsage = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setUserActivity, setHomeworkCompletion, setAttendanceTrends, setPerformanceData, setGroupEngagement, setRevenue, setAppUsage, setLoading } = analyticsSlice.actions
export default analyticsSlice.reducer
