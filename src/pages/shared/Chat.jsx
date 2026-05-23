import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp } from "../../services/firebase";

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);

  const showError = (msg) => { setError(msg); setTimeout(() => setError(""), 4000); };

  useEffect(() => { fetchContacts(); }, []);

  useEffect(() => {
    if (!activeContact) return;
    const q = query(collection(db, "messages"), where("roomId", "==", activeContact.id));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return aTime - bTime;
      });
      setMessages(msgs);
    }, (err) => {
      console.error("onSnapshot error:", err);
      showError("Failed to load messages. Check Firestore indexes.");
    });
    return unsub;
  }, [activeContact]);

  useEffect(() => {
    const el = messagesEndRef.current?.parentElement;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const snap = await getDocs(collection(db, "chat_rooms"));
      const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = rooms.sort((a, b) => {
        const aTime = a.lastMessageAt?.toMillis?.() || 0;
        const bTime = b.lastMessageAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      setContacts(sorted);
      if (sorted.length > 0) setActiveContact(sorted[0]);
    } catch (err) { console.error("Failed to load chats:", err); }
    finally { setLoading(false); }
  };

  const fetchMembers = async () => {
    const all = [];
    const existingIds = new Set();
    contacts.forEach(c => (c.participants || []).forEach(p => existingIds.add(p.id)));
    try {
      const [studSnap, teachSnap] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "teachers"))
      ]);
      studSnap.forEach(d => { const name = d.data().name || d.data().studentName || "Unknown"; all.push({ id: d.id, name, role: "Student", alreadyInChat: existingIds.has(d.id) }); });
      teachSnap.forEach(d => { const name = d.data().name || "Unknown"; all.push({ id: d.id, name, role: "Teacher", alreadyInChat: existingIds.has(d.id) }); });
    } catch (err) { console.error("Failed to fetch members:", err); }
    setMembers(all);
  };

  const openNewChat = () => { fetchMembers(); setSelectedMembers([]); setSearchTerm(""); setShowNewChat(true); };

  const toggleMember = (m) => {
    setSelectedMembers(prev => prev.some(p => p.id === m.id) ? prev.filter(p => p.id !== m.id) : [...prev, m]);
  };

  const createChatRoom = async () => {
    if (selectedMembers.length === 0) return;
    const memberIds = selectedMembers.map(m => m.id).sort();
    const roomName = selectedMembers.map(m => m.name).join(", ");
    try {
      const existing = contacts.find(c => {
        const cIds = (c.participants || []).map(p => p.id).sort();
        return JSON.stringify(cIds) === JSON.stringify(memberIds);
      });
      if (existing) {
        setActiveContact(existing);
        setShowNewChat(false);
        return;
      }
      const id = doc(collection(db, "chat_rooms")).id;
      await setDoc(doc(db, "chat_rooms", id), {
        name: roomName,
        participants: selectedMembers.map(m => ({ id: m.id, name: m.name, role: m.role })),
        lastMessage: "No messages yet",
        lastMessageAt: serverTimestamp()
      });
      setShowNewChat(false);
      await fetchContacts();
    } catch (err) { console.error("Failed to create chat room:", err); }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeContact) return;
    const text = input;
    setInput("");
    const tempId = "msg_" + Date.now();
    setMessages(prev => [...prev, { id: tempId, text, sender: "You", createdAt: new Date() }]);
    setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, lastMessage: text, lastMessageAt: { toMillis: () => Date.now() } } : c));
    try {
      const msgId = doc(collection(db, "messages")).id;
      await setDoc(doc(db, "messages", msgId), {
        roomId: activeContact.id,
        text,
        sender: "You",
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, "chat_rooms", activeContact.id), {
        lastMessage: text,
        lastMessageAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      showError("Message failed to send. Check your connection.");
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const startEdit = (msg) => {
    setEditingMsgId(msg.id);
    setEditText(msg.text);
  };

  const cancelEdit = () => {
    setEditingMsgId(null);
    setEditText("");
  };

  const saveEdit = async (msgId) => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "messages", msgId), { text: editText });
      setEditingMsgId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to edit message:", err);
      showError("Failed to edit message.");
    }
  };

  const deleteChatRoom = async (roomId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this entire chat?")) return;
    try {
      const msgsSnap = await getDocs(query(collection(db, "messages"), where("roomId", "==", roomId)));
      await Promise.all(msgsSnap.docs.map(d => deleteDoc(doc(db, "messages", d.id))));
      await deleteDoc(doc(db, "chat_rooms", roomId));
      setContacts(prev => { const next = prev.filter(c => c.id !== roomId); if (activeContact?.id === roomId) setActiveContact(next[0] || null); return next; });
    } catch (err) { console.error("Failed to delete chat:", err); showError("Failed to delete chat."); }
  };

  const deleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, "messages", msgId));
    } catch (err) {
      console.error("Failed to delete message:", err);
      showError("Failed to delete message.");
    }
  };

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:shadow-md transition-all">&larr;</button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Chat</h1>
          </div>
          <button onClick={openNewChat} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 text-sm font-medium shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200">+ New Chat</button>
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium backdrop-blur-sm">{error}</div>}

        {showNewChat && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewChat(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Members</h2>
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by name..." className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 mb-4 custom-scrollbar">
                {filteredMembers.map(m => (
                  <div key={m.id} onClick={() => !m.alreadyInChat && toggleMember(m)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${m.alreadyInChat ? "opacity-40 cursor-not-allowed" : selectedMembers.some(p => p.id === m.id) ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}>
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-150 ${m.alreadyInChat ? "border-gray-200 dark:border-gray-600" : selectedMembers.some(p => p.id === m.id) ? "bg-gradient-to-br from-blue-500 to-indigo-500 border-blue-500 shadow-sm" : "border-gray-300 dark:border-gray-500"}`}>
                      {selectedMembers.some(p => p.id === m.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${m.alreadyInChat ? "bg-gray-300 dark:bg-gray-600" : "bg-gradient-to-br from-blue-400 to-indigo-500"}`}>{m.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.alreadyInChat ? "Already in chat" : m.role}</p>
                    </div>
                  </div>
                ))}
                {filteredMembers.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No members found</p>}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowNewChat(false)} className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancel</button>
                <button onClick={createChatRoom} disabled={selectedMembers.length === 0} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 text-sm font-medium shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none transition-all duration-200">Start Chat</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex overflow-hidden h-[calc(100vh-200px)]">
          <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/50 custom-scrollbar">
            {contacts.length === 0 && <div className="flex flex-col items-center justify-center py-12 px-4"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-3"><svg className="w-7 h-7 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div><p className="text-sm text-gray-400 text-center">No chats yet</p><p className="text-xs text-gray-300 dark:text-gray-500 text-center mt-1">Click "+ New Chat" to start.</p></div>}
            {contacts.map(c => (
              <div key={c.id} onClick={() => setActiveContact(c)} className={`group p-3.5 cursor-pointer border-b border-gray-100 dark:border-gray-700/50 transition-all duration-150 hover:bg-blue-50/80 dark:hover:bg-blue-900/10 ${activeContact?.id === c.id ? "bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-l-[3px] border-l-blue-500 shadow-sm" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">{c.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${activeContact?.id === c.id ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-white"}`}>{c.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMessage || "No messages yet"}</p>
                  </div>
                  <button onClick={(e) => deleteChatRoom(c.id, e)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all" title="Delete chat">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {activeContact ? (
              <>
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">{activeContact.name[0]}</div>
                  <p className="font-semibold text-gray-800 dark:text-white">{activeContact.name}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" style={{backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} animate-fade-in`}>
                      <div className={`max-w-[75%] ${msg.sender === "You" ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20" : "bg-gray-100 dark:bg-gray-700/80 text-gray-800 dark:text-white shadow-sm"} rounded-2xl ${msg.sender === "You" ? "rounded-br-md" : "rounded-bl-md"} px-4 py-2.5`}>
                        {editingMsgId === msg.id ? (
                          <div className="flex gap-2 items-center">
                            <input value={editText} onChange={e => setEditText(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border rounded-xl bg-white dark:bg-gray-600 text-gray-800 dark:text-white border-gray-200 dark:border-gray-500 outline-none focus:ring-2 focus:ring-blue-400/30" autoFocus />
                            <button onClick={() => saveEdit(msg.id)} className="text-xs font-medium text-green-200 hover:text-white bg-white/10 px-2 py-1 rounded-lg transition-colors">Save</button>
                            <button onClick={cancelEdit} className="text-xs font-medium text-gray-300 hover:text-white bg-white/10 px-2 py-1 rounded-lg transition-colors">Cancel</button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className="flex items-center gap-2 mt-1.5 -mb-0.5">
                              {msg.createdAt && <p className={`text-[10px] ${msg.sender === "You" ? "text-blue-100" : "text-gray-400 dark:text-gray-500"}`}>{msg.createdAt.toDate?.().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || ""}</p>}
                              {msg.sender === "You" && (
                                <div className="flex gap-0.5 ml-auto">
                                  <button onClick={() => startEdit(msg)} className={`p-1 rounded-lg transition-all ${msg.sender === "You" ? "hover:bg-white/20 text-blue-100 hover:text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400"}`} title="Edit">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  </button>
                                  <button onClick={() => deleteMessage(msg.id)} className={`p-1 rounded-lg transition-all ${msg.sender === "You" ? "hover:bg-white/20 text-blue-100 hover:text-red-200" : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-red-500"}`} title="Delete">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Type a message..." className="w-full px-4 py-3 border rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm pr-12" />
                    </div>
                    <button onClick={sendMessage} disabled={!input.trim()} className="p-3.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none group">
                      <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Select a conversation</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Choose a chat from the sidebar</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes fade-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fade-in .25s ease-out}.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}.dark .custom-scrollbar::-webkit-scrollbar-thumb{background:#475569}`}</style>
    </div>
  );
}