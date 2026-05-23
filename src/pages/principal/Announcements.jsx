import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, doc, getDocs, setDoc, deleteDoc } from "../../services/firebase"

export default function Announcements() {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: "", content: "", audience: "All" })

  useEffect(() => { fetchAnnouncements() }, [])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, "announcements"))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setAnnouncements(list)
    } catch (err) {
      console.error("Failed to load announcements:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ title: "", content: "", audience: "All" })
    setEditing(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    try {
      if (editing) {
        await setDoc(doc(db, "announcements", editing.id), { ...form })
        setAnnouncements(announcements.map(a => a.id === editing.id ? { ...editing, ...form } : a))
      } else {
        const id = doc(collection(db, "announcements")).id
        await setDoc(doc(db, "announcements", id), { ...form })
        setAnnouncements([...announcements, { id, ...form }])
      }
      resetForm()
    } catch (err) {
      console.error("Failed to save announcement:", err)
    }
  }

  const handleEdit = (a) => {
    setForm({ title: a.title, content: a.content, audience: a.audience })
    setEditing(a)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return
    try {
      await deleteDoc(doc(db, "announcements", id))
      setAnnouncements(announcements.filter(a => a.id !== id))
    } catch (err) {
      console.error("Failed to delete announcement:", err)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">+ New Announcement</button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editing ? "Edit Announcement" : "New Announcement"}</h2>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Content</label>
                <textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Target Audience</label>
                <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option>All</option><option>Teachers</option><option>Parents</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{editing ? "Update" : "Create"}</button>
              <button onClick={resetForm} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {announcements.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No announcements yet</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{a.audience}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{a.content}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(a)} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
