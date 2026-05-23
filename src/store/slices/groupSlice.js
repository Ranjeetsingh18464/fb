import { createSlice } from '@reduxjs/toolkit'
const groupSlice = createSlice({
  name: 'group',
  initialState: { groups: [], currentGroup: null, posts: [], polls: [], loading: false },
  reducers: {
    setGroups: (state, action) => { state.groups = action.payload },
    setCurrentGroup: (state, action) => { state.currentGroup = action.payload },
    setPosts: (state, action) => { state.posts = action.payload },
    addPost: (state, action) => { state.posts.unshift(action.payload) },
    setPolls: (state, action) => { state.polls = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setGroups, setCurrentGroup, setPosts, addPost, setPolls, setLoading } = groupSlice.actions
export default groupSlice.reducer
