import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import schoolReducer from './slices/schoolSlice'
import homeworkReducer from './slices/homeworkSlice'
import attendanceReducer from './slices/attendanceSlice'
import resultReducer from './slices/resultSlice'
import groupReducer from './slices/groupSlice'
import messageReducer from './slices/messageSlice'
import notificationReducer from './slices/notificationSlice'
import feeReducer from './slices/feeSlice'
import achievementReducer from './slices/achievementSlice'
import quizReducer from './slices/quizSlice'
import moderationReducer from './slices/moderationSlice'
import analyticsReducer from './slices/analyticsSlice'
import themeReducer from './slices/themeSlice'
import aiReducer from './slices/aiSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    homework: homeworkReducer,
    attendance: attendanceReducer,
    result: resultReducer,
    group: groupReducer,
    message: messageReducer,
    notification: notificationReducer,
    fee: feeReducer,
    achievement: achievementReducer,
    quiz: quizReducer,
    moderation: moderationReducer,
    analytics: analyticsReducer,
    theme: themeReducer,
    ai: aiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['auth/setUser', 'notification/setupMessaging'] } })
})

export default store
