import { createSlice } from '@reduxjs/toolkit'

const moderationSlice = createSlice({
  name: 'moderation',
  initialState: { reports: [], moderationLogs: [], flaggedContent: [], spamList: [], blockedWords: [], loading: false },
  reducers: {
    setReports: (state, action) => { state.reports = action.payload },
    setModerationLogs: (state, action) => { state.moderationLogs = action.payload },
    setFlaggedContent: (state, action) => { state.flaggedContent = action.payload },
    setSpamList: (state, action) => { state.spamList = action.payload },
    setBlockedWords: (state, action) => { state.blockedWords = action.payload },
    addModerationLog: (state, action) => { state.moderationLogs.unshift(action.payload) },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setReports, setModerationLogs, setFlaggedContent, setSpamList, setBlockedWords, addModerationLog, setLoading } = moderationSlice.actions
export default moderationSlice.reducer
