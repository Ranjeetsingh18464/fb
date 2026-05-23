import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
    sidebarOpen: true,
    sidebarCollapsed: false,
    schoolName: 'DAV PUBLIC SCHOOL',
    schoolLogo: null,
    themeColor: '#4f46e5',
    tagline: '',
    sidebarPosition: 'left',
    compactMode: false
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.mode)
    },
    setTheme: (state, action) => { state.mode = action.payload; localStorage.setItem('theme', action.payload) },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    toggleSidebarCollapsed: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed },
    setSchoolSettings: (state, action) => {
      state.schoolName = action.payload.schoolName ?? state.schoolName
      state.schoolLogo = action.payload.logo ?? state.schoolLogo
      state.themeColor = action.payload.themeColor ?? state.themeColor
      state.tagline = action.payload.tagline ?? state.tagline
      state.sidebarPosition = action.payload.sidebarPosition ?? state.sidebarPosition
      state.compactMode = action.payload.compactMode ?? state.compactMode
    }
  }
})
export const { toggleTheme, setTheme, toggleSidebar, toggleSidebarCollapsed, setSchoolSettings } = themeSlice.actions
export default themeSlice.reducer
