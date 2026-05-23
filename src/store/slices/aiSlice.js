import { createSlice } from '@reduxjs/toolkit'

const aiSlice = createSlice({
  name: 'ai',
  initialState: { chatHistory: [], studyPlan: null, recommendations: [], quizGenerated: null, summary: null, grammarResult: null, loading: false, error: null },
  reducers: {
    addChatMessage: (state, action) => { state.chatHistory.push(action.payload) },
    setChatHistory: (state, action) => { state.chatHistory = action.payload },
    setStudyPlan: (state, action) => { state.studyPlan = action.payload },
    setRecommendations: (state, action) => { state.recommendations = action.payload },
    setQuizGenerated: (state, action) => { state.quizGenerated = action.payload },
    setSummary: (state, action) => { state.summary = action.payload },
    setGrammarResult: (state, action) => { state.grammarResult = action.payload },
    setLoading: (state, action) => { state.loading = action.payload },
    setError: (state, action) => { state.error = action.payload }
  }
})
export const { addChatMessage, setChatHistory, setStudyPlan, setRecommendations, setQuizGenerated, setSummary, setGrammarResult, setLoading, setError } = aiSlice.actions
export default aiSlice.reducer
