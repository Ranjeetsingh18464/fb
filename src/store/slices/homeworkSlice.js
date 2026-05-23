import { createSlice } from '@reduxjs/toolkit'

const homeworkSlice = createSlice({
  name: 'homework',
  initialState: { homework: [], loading: false, filter: { class: '', section: '', subject: '', date: '' } },
  reducers: {
    setHomework: (state, action) => { state.homework = action.payload },
    addHomework: (state, action) => { state.homework.unshift(action.payload) },
    updateHomework: (state, action) => { const idx = state.homework.findIndex(h => h.id === action.payload.id); if (idx >= 0) state.homework[idx] = action.payload },
    setLoading: (state, action) => { state.loading = action.payload },
    setFilter: (state, action) => { state.filter = { ...state.filter, ...action.payload } }
  }
})
export const { setHomework, addHomework, updateHomework, setLoading, setFilter } = homeworkSlice.actions
export default homeworkSlice.reducer
