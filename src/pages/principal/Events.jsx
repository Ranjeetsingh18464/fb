import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, doc, getDocs, setDoc, deleteDoc } from "../../services/firebase"

export default function Events() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: "", date: "", venue: "", type: "Academic" })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, "events"))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setEvents(list)
    } catch (err) {
      console.error("Failed to load events:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ name: "", date: "", venue: "", type: "Academic" })
    setEditing(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    try {
      if (editing) {
        await setDoc(doc(db, "events", editing.id), { ...form })
        setEvents(events.map(e => e.id === editing.id ? { ...editing, ...form } : e))
      } else {
        const id = doc(collection(db, "events")).id
        await setDoc(doc(db, "events", id), { ...form })
        setEvents([...events, { id, ...form }])
      }
      resetForm()
    } catch (err) {
      console.error("Failed to save event:", err)
    }
  }

  const handleEdit = (ev) => {
    setForm({ name: ev.name, date: ev.date, venue: ev.venue, type: ev.type })
    setEditing(ev)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return
    try {
      await deleteDoc(doc(db, "events", id))
      setEvents(events.filter(e => e.id !== id))
    } catch (err) {
      console.error("Failed to delete event:", err)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">School Events</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">+ Add Event</button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editing ? "Edit Event" : "New Event"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Venue</label>
                <input type="text" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option>Academic</option><option>Sports</option><option>Cultural</option><option>Meeting</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{editing ? "Update" : "Create"}</button>
              <button onClick={resetForm} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No events yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{ev.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{ev.type}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-medium">Date:</span> {ev.date}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-medium">Venue:</span> {ev.venue}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(ev)} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(ev.id)} className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
