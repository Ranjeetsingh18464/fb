import React, { useState } from 'react';

const conversations = [
  { id: 1, name: 'Aarav Sharma', role: 'Student', lastMessage: 'Thank you for clarifying the doubt!', time: '5 min ago', unread: 2, online: true },
  { id: 2, name: 'Mrs. Priya Sharma', role: 'Parent', lastMessage: 'When is the next PTA meeting?', time: '1 hour ago', unread: 0, online: false },
  { id: 3, name: 'Divya Verma', role: 'Student', lastMessage: 'I have a question about the homework.', time: '3 hours ago', unread: 1, online: true },
  { id: 4, name: 'Mr. Rajesh Kumar', role: 'Teacher', lastMessage: 'Sure, I will share the notes.', time: '1 day ago', unread: 0, online: false },
  { id: 5, name: 'Chirag Singh', role: 'Student', lastMessage: 'Can you check my assignment?', time: '2 days ago', unread: 0, online: false },
];

const messages = [
  { id: 1, sender: 'Aarav Sharma', text: 'Good morning ma\'am! I had a doubt about the algebra problem.', time: '10:15 AM', type: 'received' },
  { id: 2, sender: 'You', text: 'Good morning! Sure, which problem are you referring to?', time: '10:17 AM', type: 'sent' },
  { id: 3, sender: 'Aarav Sharma', text: 'The one from chapter 5, question 3. I\'m stuck on the factorization step.', time: '10:18 AM', type: 'received' },
  { id: 4, sender: 'You', text: 'Ah, I see. Let me explain: First, take the common factor out, then use the quadratic formula. I\'ll send you a quick video explanation.', time: '10:20 AM', type: 'sent' },
  { id: 5, sender: 'Aarav Sharma', text: 'Thank you for clarifying the doubt!', time: '10:25 AM', type: 'received' },
];

export default function Communication() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    setMessageText('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Communication</h1>
        <p>Message parents and students directly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="card overflow-y-auto lg:col-span-1">
          <div className="mb-4">
            <input type="text" className="input-field w-full" placeholder="Search conversations..." />
          </div>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedChat === conv.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                onClick={() => setSelectedChat(conv.id)}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {conv.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{conv.name}</p>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.role} • {conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conv.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2 flex flex-col">
          {selectedChat ? (
            <>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conversations.find((c) => c.id === selectedChat)?.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{conversations.find((c) => c.id === selectedChat)?.name}</p>
                    <p className="text-xs text-gray-500">{conversations.find((c) => c.id === selectedChat)?.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.type === 'sent' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'sent' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                  <button type="button" className="text-gray-500 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  </button>
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="submit" className="btn-primary">Send</button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">Select a conversation</p>
                <p className="text-sm">Choose a student or parent to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
