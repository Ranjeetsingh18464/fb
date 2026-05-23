import { createSlice } from '@reduxjs/toolkit'

const quizSlice = createSlice({
  name: 'quiz',
  initialState: { quizzes: [], myQuizzes: [], activeQuiz: null, quizResults: [], loading: false },
  reducers: {
    setQuizzes: (state, action) => { state.quizzes = action.payload },
    setMyQuizzes: (state, action) => { state.myQuizzes = action.payload },
    setActiveQuiz: (state, action) => { state.activeQuiz = action.payload },
    setQuizResults: (state, action) => { state.quizResults = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setQuizzes, setMyQuizzes, setActiveQuiz, setQuizResults, setLoading } = quizSlice.actions
export default quizSlice.reducer
