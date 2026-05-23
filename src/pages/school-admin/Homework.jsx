import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, getDocs, setDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from '../../services/firebase'

export default function Homework() {
  const navigate = useNavigate()
  const [homeworks, setHomeworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ class: '', section: '', subject: '', title: '', dueDate: '', description: '' })

  useEffect(() => { fetchHomework(); }, []);

  const fetchHomework = async () => {
    try {
      const q = query(collection(db, 'homework'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setHomeworks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error('Failed to load homework:', err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingId(null)
    setForm({ class: '', section: '', subject: '', title: '', dueDate: '', description: '' })
    setShowForm(true)
  }

  const openEdit = (h) => {
    setEditingId(h.id)
    setForm({ class: h.class, section: h.section || '', subject: h.subject, title: h.title, dueDate: h.dueDate, description: h.description })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'homework', editingId), form);
        setHomeworks(homeworks.map(h => h.id === editingId ? { ...h, ...form } : h));
      } else {
        const id = doc(collection(db, 'homework')).id;
        await setDoc(doc(db, 'homework', id), { ...form, createdAt: serverTimestamp() });
        setHomeworks([{ id, ...form, createdAt: new Date().toISOString() }, ...homeworks]);
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) { console.error('Failed to save homework:', err); }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this homework?')) return;
    try {
      await deleteDoc(doc(db, 'homework', id));
      setHomeworks(homeworks.filter(h => h.id !== id));
    } catch (err) { console.error('Failed to delete homework:', err); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:shadow-md transition-all">←</button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homework</h1>
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">+ Add Homework</button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editingId ? 'Edit Homework' : 'Add Homework'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Class</label>
                <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all">
                  <option value="">Select class</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Section</label>
                <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all">
                  <option value="">Select section</option>
                  {["A", "B", "C", "D", "E"].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              <input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all" />
              <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all" />
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm mb-4 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all resize-none" />
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">{editingId ? 'Update' : 'Save'}</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeworks.length === 0 && <p className="text-sm text-gray-400 text-center col-span-full py-8">No homework assigned yet</p>}
          {homeworks.map(h => (
            <div key={h.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{h.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Class {h.class} | Section {h.section || "—"} · {h.subject}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Due: {h.dueDate}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{h.description}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(h)} className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition">Edit</button>
                <button onClick={() => handleDelete(h.id)} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
