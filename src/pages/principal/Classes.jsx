import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, setDoc, deleteDoc } from '../../services/firebase'

const sections = ['A', 'B', 'C', 'D', 'E']

export default function Classes() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', section: '', teacher: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classSnap, teacherSnap, studentSnap] = await Promise.all([
          getDocs(collection(db, 'classes')),
          getDocs(collection(db, 'teachers')),
          getDocs(collection(db, 'students'))
        ])
        const c = []; classSnap.forEach(d => c.push({ id: d.id, ...d.data() }))
        const t = []; teacherSnap.forEach(d => t.push({ id: d.id, ...d.data() }))
        const s = []; studentSnap.forEach(d => s.push({ id: d.id, ...d.data() }))
        setClasses(c); setTeachers(t); setAllStudents(s)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStudentsForClass = (cls) => allStudents.filter(s => (s.grade || s.class) === cls.name && s.section === cls.section)

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', section: '', teacher: '' })
    setShowForm(true)
  }

  const openEdit = (c) => {
    setEditing(c.id)
    setForm({ name: c.name, section: c.section, teacher: c.teacher })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await setDoc(doc(db, 'classes', editing), { ...form })
        setClasses(classes.map(c => c.id === editing ? { ...c, ...form } : c))
      } else {
        const id = doc(collection(db, 'classes')).id
        const pos = classes.length > 0 ? Math.max(...classes.map(c => c.position ?? 0)) + 1 : 0
        await setDoc(doc(db, 'classes', id), { ...form, position: pos })
        setClasses([...classes, { id, ...form, position: pos }])
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      console.error('Failed to save class:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return
    try {
      await deleteDoc(doc(db, 'classes', id))
      setClasses(classes.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete class:', err)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:shadow-md transition-all">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">+ Add Class</button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Class' : 'Add Class'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input placeholder="Class Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none" />
              <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none">
                <option value="">Select Section</option>
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none">
                <option value="">Select Class Teacher</option>
                {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">Save</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Class</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Section</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Class Teacher</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Students</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {classes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{c.section}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{c.teacher}</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{getStudentsForClass(c).length}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => openEdit(c)} className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classes.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No classes yet</p>}
        </div>
      </div>
    </div>
  )
}
