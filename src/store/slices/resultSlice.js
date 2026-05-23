import { createSlice } from '@reduxjs/toolkit'
const resultSlice = createSlice({
  name: 'result',
  initialState: { results: [], myResults: [], loading: false },
  reducers: {
    setResults: (state, action) => { state.results = action.payload },
    setMyResults: (state, action) => { state.myResults = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setResults, setMyResults, setLoading } = resultSlice.actions
export default resultSlice.reducer
