import { createSlice } from '@reduxjs/toolkit'
const messageSlice = createSlice({
  name: 'message',
  initialState: { conversations: [], currentChat: [], activeConversation: null, loading: false },
  reducers: {
    setConversations: (state, action) => { state.conversations = action.payload },
    setCurrentChat: (state, action) => { state.currentChat = action.payload },
    addMessage: (state, action) => { state.currentChat.push(action.payload) },
    setActiveConversation: (state, action) => { state.activeConversation = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setConversations, setCurrentChat, addMessage, setActiveConversation, setLoading } = messageSlice.actions
export default messageSlice.reducer
