import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "../../services/firebase";

const typeIcons = {
  homework: "📚",
  result: "📊",
  attendance: "✅",
  fee: "💰",
  notice: "📢",
  general: "📌",
};

const typeOptions = ["homework", "result", "attendance", "fee", "notice", "general"];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "general", message: "", recipients: [] });
  const recipientOptions = ["Teachers", "Students", "Parents"];

  const toggleRecipient = (r) => {
    setForm(prev => ({
      ...prev,
      recipients: prev.recipients.includes(r) ? prev.recipients.filter(x => x !== r) : [...prev.recipients, r]
    }))
  }

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "notifications"))
        const list = []
        snap.forEach(d => list.push({ id: d.id, ...d.data() }))
        setNotifications(list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)))
      } catch (err) {
        console.error("Failed to load notifications:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const markAllRead = async () => {
    try {
      for (const n of notifications) {
        if (!n.read) await updateDoc(doc(db, "notifications", n.id), { read: true })
      }
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error("Failed to mark all read:", err)
    }
  };

  const toggleRead = async (id) => {
    const n = notifications.find(n => n.id === id)
    if (!n) return
    try {
      await updateDoc(doc(db, "notifications", id), { read: !n.read })
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n))
    } catch (err) {
      console.error("Failed to toggle read:", err)
    }
  };

  const handleCreate = async () => {
    if (!form.message.trim()) return
    try {
      const id = doc(collection(db, "notifications")).id
      const notif = {
        type: form.type,
        message: form.message,
        recipients: form.recipients,
        read: false,
        createdAt: new Date().toISOString()
      }
      await setDoc(doc(db, "notifications", id), notif)
      setNotifications([{ id, ...notif }, ...notifications])
      setForm({ type: "general", message: "", recipients: [] })
      setShowForm(false)
    } catch (err) {
      console.error("Failed to create notification:", err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return
    try {
      await deleteDoc(doc(db, "notifications", id))
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h1>
            {unreadCount > 0 && <span className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{unreadCount} new</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowForm(!showForm); setForm({ type: "general", message: "", recipients: [] }) }} className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">+ Create</button>
            {unreadCount > 0 && <button onClick={markAllRead} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Mark All Read</button>}
          </div>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Notification</h2>
            <div className="flex flex-wrap gap-3 mb-3">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                {typeOptions.map(t => <option key={t} value={t}>{typeIcons[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
              <input type="text" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Notification message..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <button onClick={handleCreate} disabled={!form.message.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Send</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Send to:</span>
              {recipientOptions.map(r => (
                <button key={r} onClick={() => toggleRecipient(r)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${form.recipients.includes(r) ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                  {r}
                </button>
              ))}
              {form.recipients.length === 0 && <span className="text-xs text-gray-400">(all)</span>}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No notifications yet.</p>
          ) : notifications.map(n => (
            <div key={n.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start gap-3 ${!n.read ? "border-l-4 border-blue-500" : "opacity-70"}`}>
              <div className="text-2xl cursor-pointer" onClick={() => toggleRead(n.id)}>{typeIcons[n.type] || "📌"}</div>
              <div className="flex-1 cursor-pointer" onClick={() => toggleRead(n.id)}>
                <p className={`text-gray-800 dark:text-white ${!n.read ? "font-semibold" : ""}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</p>
                {n.recipients && n.recipients.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {n.recipients.map(r => <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{r}</span>)}
                  </div>
                )}
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
              <button onClick={() => handleDelete(n.id)} className="text-gray-400 hover:text-red-500 text-xs p-1">&times;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
