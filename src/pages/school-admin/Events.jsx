import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from '../../services/firebase'

const typeColors = { Academic: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', Sports: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', Cultural: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' }

export default function Events() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', date: '', description: '', type: 'Academic' })

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'events'))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setEvents(list)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', date: '', description: '', type: 'Academic' })
    setShowForm(true)
  }

  const openEdit = (e) => {
    setEditing(e.id)
    setForm({ title: e.title, date: e.date, description: e.description, type: e.type })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'events', editing), form)
        setEvents(events.map(ev => ev.id === editing ? { ...ev, ...form } : ev))
      } else {
        const id = doc(collection(db, 'events')).id
        await setDoc(doc(db, 'events', id), form)
        setEvents([...events, { id, ...form }])
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      console.error('Failed to save event:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await deleteDoc(doc(db, 'events', id))
      setEvents(events.filter(ev => ev.id !== id))
    } catch (err) {
      console.error('Failed to delete event:', err)
    }
  }

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
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">← Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
          <button onClick={openAdd} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">+ Add Event</button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Event' : 'Add Event'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input placeholder="Event Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm mb-4">
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
            </select>
            <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm mb-4" />
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Save</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(ev => (
            <div key={ev.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ev.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[ev.type]}`}>{ev.type}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ev.date}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{ev.description}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(ev)} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition">Edit</button>
                <button onClick={() => handleDelete(ev.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
