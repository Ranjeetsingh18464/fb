import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialConversations = [
  { id: 1, name: 'Dr. Sharma', role: 'Teacher', lastMsg: 'Please submit your assignment by Friday.', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Principal Mehta', role: 'Admin', lastMsg: 'School will remain closed tomorrow.', time: '1h ago', unread: 0, online: true },
  { id: 3, name: 'Mrs. Gupta (Parent)', role: 'Parent', lastMsg: 'Thank you for the update.', time: '3h ago', unread: 1, online: false },
  { id: 4, name: 'Coach Sharma', role: 'Teacher', lastMsg: 'Practice at 4 PM tomorrow.', time: '1d ago', unread: 0, online: false },
]

const initialMessages = {
  1: [
    { id: 1, sender: 'Dr. Sharma', text: 'Hello, please submit your math assignment.', time: '10:30 AM', received: true },
    { id: 2, sender: 'You', text: 'Sure, I will submit it by tomorrow.', time: '10:32 AM', received: false },
    { id: 3, sender: 'Dr. Sharma', text: 'Please submit your assignment by Friday.', time: '10:33 AM', received: true },
  ],
}

export default function Chat() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState(initialConversations)
  const [messages, setMessages] = useState(initialMessages)
  const [selectedChat, setSelectedChat] = useState(null)
  const [search, setSearch] = useState('')
  const [newMsg, setNewMsg] = useState('')

  const filtered = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  const sendMessage = () => {
    if (!newMsg.trim() || !selectedChat) return
    const conv = conversations.find(c => c.id === selectedChat)
    const msg = { id: Date.now(), sender: 'You', text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), received: false }
    setMessages({ ...messages, [selectedChat]: [...(messages[selectedChat] || []), msg] })
    setConversations(conversations.map(c => c.id === selectedChat ? { ...c, lastMsg: newMsg, time: 'Just now', unread: 0 } : c))
    setNewMsg('')
  }

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row h-[75vh]">
          <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <input className="input-field w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map(conv => (
                <div key={conv.id} onClick={() => { setSelectedChat(conv.id); setConversations(conversations.map(c => c.id === conv.id ? { ...c, unread: 0 } : c)) }} className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors ${selectedChat === conv.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">{conv.name.charAt(0)}</div>
                    {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{conv.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMsg}</span>
                      {conv.unread > 0 && <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{conv.unread}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
                    {conversations.find(c => c.id === selectedChat)?.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{conversations.find(c => c.id === selectedChat)?.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({conversations.find(c => c.id === selectedChat)?.role})</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {(messages[selectedChat] || []).map(msg => (
                    <div key={msg.id} className={`flex ${msg.received ? '' : 'justify-end'}`}>
                      <div className={`max-w-[75%] p-3 rounded-xl text-sm ${msg.received ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                        <p>{msg.text}</p>
                        <span className={`text-xs mt-1 block ${msg.received ? 'text-gray-400' : 'text-blue-200'}`}>{msg.time} {!msg.received && ' ✓✓'}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert('File attachment coming soon!')} className="text-gray-400 hover:text-blue-500 transition-colors">📎</button>
                    <button onClick={() => alert('Voice recording coming soon!')} className="text-gray-400 hover:text-blue-500 transition-colors">🎤</button>
                    <input className="input-field flex-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none" placeholder="Type a message..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                    <button onClick={sendMessage} className="btn-primary p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">➤</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-lg font-medium mb-1">Select a conversation</p>
                  <p className="text-sm">Choose a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
