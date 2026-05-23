import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from '../../services/firebase'

const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const sections = ['A', 'B', 'C', 'D', 'E']

export default function Announcements() {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterClass, setFilterClass] = useState('All')
  const [filterSection, setFilterSection] = useState('All')
  const [form, setForm] = useState({ title: '', content: '', date: '', targetClass: 'All', targetSection: 'All' })

  useEffect(() => { fetchAnnouncements() }, [])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'announcements'))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setAnnouncements(list)
    } catch (err) {
      console.error('Failed to load announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', content: '', date: '', targetClass: 'All', targetSection: 'All' })
    setShowForm(true)
  }

  const openEdit = (a) => {
    setEditing(a.id)
    setForm({ title: a.title, content: a.content, date: a.date, targetClass: a.targetClass, targetSection: a.targetSection })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'announcements', editing), form)
        setAnnouncements(announcements.map(a => a.id === editing ? { ...a, ...form } : a))
      } else {
        const id = doc(collection(db, 'announcements')).id
        await setDoc(doc(db, 'announcements', id), form)
        setAnnouncements([...announcements, { id, ...form }])
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      console.error('Failed to save announcement:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    try {
      await deleteDoc(doc(db, 'announcements', id))
      setAnnouncements(announcements.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to delete announcement:', err)
    }
  }

  const filtered = announcements.filter(a => {
    if (filterClass !== 'All' && a.targetClass !== filterClass && a.targetClass !== 'All') return false
    if (filterSection !== 'All' && a.targetSection !== filterSection && a.targetSection !== 'All') return false
    return true
  })

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <button onClick={openAdd} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">+ Add Announcement</button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="All">All Classes</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filterSection} onChange={e => setFilterSection(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="All">All Sections</option>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Announcement' : 'Add Announcement'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <select value={form.targetClass} onChange={e => setForm({ ...form, targetClass: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="All">All Classes</option>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={form.targetSection} onChange={e => setForm({ ...form, targetSection: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="All">All Sections</option>
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <textarea placeholder="Content" rows={3} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm mb-4" />
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Save</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map(a => (
            <div key={a.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.date}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(a)} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{a.content}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Target: {a.targetClass} · {a.targetSection}</p>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No announcements match the selected filters.</p>}
        </div>
      </div>
    </div>
  )
}
