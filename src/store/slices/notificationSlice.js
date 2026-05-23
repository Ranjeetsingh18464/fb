import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { notifications: [], unreadCount: 0, fcmToken: null, loading: false },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter(n => !n.read).length
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
    },
    markAsRead: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload)
      if (n && !n.read) { n.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1) }
    },
    markAllRead: (state) => {
      state.notifications.forEach(n => { n.read = true })
      state.unreadCount = 0
    },
    setFcmToken: (state, action) => { state.fcmToken = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setNotifications, addNotification, markAsRead, markAllRead, setFcmToken, setLoading } = notificationSlice.actions
export default notificationSlice.reducer
