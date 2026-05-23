import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from '../../services/firebase'

const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const sections = ['A', 'B', 'C', 'D', 'E']

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', studentId: '', email: '', phone: '', grade: '', section: '', parent: '', parentPhone: '', address: '' })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'students'))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setStudents(list)
    } catch (err) {
      console.error('Failed to load students:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', studentId: '', email: '', phone: '', grade: '', section: '', parent: '', parentPhone: '', address: '' })
    setShowForm(true)
  }

  const openEdit = (s) => {
    setEditing(s.id)
    setForm({ name: s.name, studentId: s.studentId, email: s.email, phone: s.phone, grade: s.grade, section: s.section, parent: s.parent, parentPhone: s.parentPhone, address: s.address })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'students', editing), form)
        setStudents(students.map(s => s.id === editing ? { ...s, ...form } : s))
      } else {
        const id = doc(collection(db, 'students')).id
        await setDoc(doc(db, 'students', id), form)
        setStudents([...students, { id, ...form }])
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      console.error('Failed to save student:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    try {
      await deleteDoc(doc(db, 'students', id))
      setStudents(students.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete student:', err)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <button onClick={openAdd} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">+ Add Student</button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                  <input type="text" placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Student ID</label>
                  <input type="text" placeholder="e.g. STU-001" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                  <input type="email" placeholder="student@school.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                  <input type="text" placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grade</label>
                  <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Grade</option>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Section</label>
                  <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Section</option>
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Parent Name</label>
                  <input type="text" placeholder="Guardian name" value={form.parent} onChange={e => setForm({ ...form, parent: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Parent Phone</label>
                  <input type="text" placeholder="Parent phone" value={form.parentPhone} onChange={e => setForm({ ...form, parentPhone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Address</label>
                  <input type="text" placeholder="Home address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">{editing ? 'Update Student' : 'Add Student'}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Grade</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Section</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Parent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Phone</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{s.studentId}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.grade}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.section}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.parent}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.phone}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(s)} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition mr-1">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No students yet</p>}
        </div>
      </div>
    </div>
  )
}
