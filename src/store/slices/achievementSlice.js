import { createSlice } from '@reduxjs/toolkit'

const achievementSlice = createSlice({
  name: 'achievement',
  initialState: { achievements: [], badges: [], xp: 0, streak: 0, leaderboard: [], loading: false },
  reducers: {
    setAchievements: (state, action) => { state.achievements = action.payload },
    setBadges: (state, action) => { state.badges = action.payload },
    addAchievement: (state, action) => { state.achievements.unshift(action.payload) },
    addBadge: (state, action) => { state.badges.push(action.payload) },
    setXp: (state, action) => { state.xp = action.payload },
    setStreak: (state, action) => { state.streak = action.payload },
    setLeaderboard: (state, action) => { state.leaderboard = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setAchievements, setBadges, addAchievement, addBadge, setXp, setStreak, setLeaderboard, setLoading } = achievementSlice.actions
export default achievementSlice.reducer
