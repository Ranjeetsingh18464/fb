import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialTeachers = [
  { id: 1, name: 'Ms. Sarah Johnson', subject: 'Mathematics', classes: '8A, 8B, 9A', students: 98, status: 'active', email: 'sarah.j@school.com' },
  { id: 2, name: 'Mr. James Williams', subject: 'Science', classes: '7A, 7B, 8A', students: 86, status: 'active', email: 'james.w@school.com' },
  { id: 3, name: 'Mrs. Emily Davis', subject: 'English', classes: '6A, 6B, 6C', students: 112, status: 'active', email: 'emily.d@school.com' },
  { id: 4, name: 'Mr. Robert Brown', subject: 'History', classes: '9A, 9B', students: 78, status: 'active', email: 'robert.b@school.com' }
]

export default function Teachers() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState(initialTeachers)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [viewTeacher, setViewTeacher] = useState(null)
  const [form, setForm] = useState({ name: '', subject: '', classes: '', students: '', email: '', status: 'active' })

  const resetForm = () => setForm({ name: '', subject: '', classes: '', students: '', email: '', status: 'active' })

  const handleSubmit = () => {
    if (!form.name || !form.subject) return
    if (editId) {
      setTeachers(teachers.map(t => t.id === editId ? { ...t, ...form, students: Number(form.students) } : t))
      setEditId(null)
    } else {
      setTeachers([...teachers, { id: Date.now(), ...form, students: Number(form.students) }])
    }
    resetForm(); setShowForm(false)
  }

  const handleEdit = (t) => {
    setEditId(t.id); setForm({ name: t.name, subject: t.subject, classes: t.classes, students: String(t.students), email: t.email, status: t.status })
    setShowForm(true)
  }

  return <div className="page-container">
    <div className="page-header">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/school_admin')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div><h1 className="page-title">Teachers</h1><p className="page-subtitle">Manage teaching staff ({teachers.length} total)</p></div>
      </div>
    </div>

    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditId(null); resetForm() } }} className="btn-primary">➕ Add Teacher</button>
      {showForm && <button onClick={() => { setShowForm(false); setEditId(null); resetForm() }} className="btn-outline">Cancel</button>}
    </div>

    {showForm && <div className="card mb-6 p-4">
      <h3 className="font-semibold mb-4">{editId ? 'Edit Teacher' : 'New Teacher'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Full name" />
        <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="Subject" />
        <input value={form.classes} onChange={e => setForm({ ...form, classes: e.target.value })} className="input-field" placeholder="Classes (e.g. 8A, 8B)" />
        <input type="number" value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} className="input-field" placeholder="Students count" />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="Email" />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button onClick={handleSubmit} className="btn-primary mt-3">{editId ? 'Update' : 'Add'} Teacher</button>
    </div>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teachers.map((t) => <div key={t.id} className="card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xl font-bold text-primary-600">{t.name.split(' ').map(n => n[0]).join('')}</div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">{t.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.subject} • {t.classes}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{t.students} students • {t.email}</p>
          </div>
          <span className={`badge-${t.status === 'active' ? 'success' : 'warning'}`}>{t.status === 'active' ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setViewTeacher(t)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View</button>
          <button onClick={() => handleEdit(t)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Edit</button>
          <button onClick={() => { if (confirm('Remove this teacher?')) setTeachers(teachers.filter(x => x.id !== t.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-sm">Delete</button>
        </div>
      </div>)}
    </div>

    {viewTeacher && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewTeacher(null)}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{viewTeacher.name}</h3>
          <button onClick={() => setViewTeacher(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Subject:</span> {viewTeacher.subject}</p>
          <p><span className="font-medium">Classes:</span> {viewTeacher.classes}</p>
          <p><span className="font-medium">Students:</span> {viewTeacher.students}</p>
          <p><span className="font-medium">Email:</span> {viewTeacher.email}</p>
          <p><span className="font-medium">Status:</span> <span className={`badge-${viewTeacher.status === 'active' ? 'success' : 'warning'}`}>{viewTeacher.status === 'active' ? 'Active' : 'Inactive'}</span></p>
        </div>
      </div>
    </div>}
  </div>
}
