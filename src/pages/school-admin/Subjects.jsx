import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialSubjects = [
  { id: 1, name: 'Mathematics', code: 'MTH101', teacher: 'Anita Desai', class: '1', section: 'A' },
  { id: 2, name: 'English', code: 'ENG101', teacher: 'Rajesh Kumar', class: '1', section: 'A' },
  { id: 3, name: 'Science', code: 'SCI101', teacher: 'Meena Joshi', class: '2', section: 'A' },
  { id: 4, name: 'Hindi', code: 'HIN101', teacher: 'Sunita Sharma', class: '1', section: 'B' },
]

export default function Subjects() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState(initialSubjects)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', teacher: '', class: '', section: '' })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', code: '', teacher: '', class: '', section: '' })
    setShowForm(true)
  }

  const openEdit = (s) => {
    setEditing(s.id)
    setForm({ name: s.name, code: s.code, teacher: s.teacher, class: s.class, section: s.section || '' })
    setShowForm(true)
  }

  const handleSave = () => {
    if (editing) {
      setSubjects(subjects.map(s => s.id === editing ? { ...s, ...form } : s))
    } else {
      setSubjects([...subjects, { id: Date.now(), ...form }])
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this subject?')) setSubjects(subjects.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">← Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Subjects</h1>
          <button onClick={openAdd} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">+ Add Subject</button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Subject' : 'Add Subject'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input placeholder="Subject Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input placeholder="Subject Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input placeholder="Assigned Teacher" value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Class</label>
                <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option value="">Select class</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Section</label>
                <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option value="">Select section</option>
                  {["A", "B", "C", "D", "E"].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Save</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Code</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Teacher</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Class</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{s.code}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.teacher}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Class {s.class} | Section {s.section || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(s)} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition mr-1">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
