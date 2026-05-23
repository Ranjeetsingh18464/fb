import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Classes() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([
    { id: 1, name: 'Class 6', section: 'A, B, C', students: 98, teacher: 'Ms. Johnson', subjects: 8 },
    { id: 2, name: 'Class 7', section: 'A, B', students: 72, teacher: 'Mr. Williams', subjects: 8 },
    { id: 3, name: 'Class 8', section: 'A, B, C, D', students: 134, teacher: 'Mrs. Davis', subjects: 9 },
    { id: 4, name: 'Class 9', section: 'A, B', students: 78, teacher: 'Mr. Brown', subjects: 10 },
    { id: 5, name: 'Class 10', section: 'A, B, C', students: 112, teacher: 'Ms. Wilson', subjects: 10 }
  ])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [viewClass, setViewClass] = useState(null)
  const [form, setForm] = useState({ name: '', section: '', students: '', teacher: '', subjects: '' })

  const resetForm = () => setForm({ name: '', section: '', students: '', teacher: '', subjects: '' })

  const handleSubmit = () => {
    if (!form.name) return
    if (editId) {
      setClasses(classes.map(c => c.id === editId ? { ...c, ...form, students: Number(form.students), subjects: Number(form.subjects) } : c))
      setEditId(null)
    } else {
      setClasses([...classes, { id: Date.now(), ...form, students: Number(form.students), subjects: Number(form.subjects) }])
    }
    resetForm(); setShowForm(false)
  }

  const handleEdit = (c) => {
    setEditId(c.id); setForm({ name: c.name, section: c.section, students: String(c.students), teacher: c.teacher, subjects: String(c.subjects) })
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
        <div><h1 className="page-title">Classes</h1><p className="page-subtitle">Manage classes and sections</p></div>
      </div>
    </div>

    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditId(null); resetForm() } }} className="btn-primary">➕ Add Class</button>
      {showForm && <button onClick={() => { setShowForm(false); setEditId(null); resetForm() }} className="btn-outline">Cancel</button>}
    </div>

    {showForm && <div className="card mb-6 p-4">
      <h3 className="font-semibold mb-4">{editId ? 'Edit Class' : 'New Class'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Class name" />
        <input value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="input-field" placeholder="Sections (A, B, C)" />
        <input type="number" value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} className="input-field" placeholder="Students" />
        <input value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} className="input-field" placeholder="Class teacher" />
        <input type="number" value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} className="input-field" placeholder="Subjects" />
      </div>
      <button onClick={handleSubmit} className="btn-primary mt-3">{editId ? 'Update' : 'Add'} Class</button>
    </div>}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((c) => <div key={c.id} className="card-hover">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{c.name}</h3>
            <button onClick={() => setViewClass(c)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <span className="badge-primary">{c.section.split(', ').length} Sections</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>👥 {c.students} students</span>
          <span>📚 {c.subjects} subjects</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Class Teacher: <span className="font-medium text-gray-900 dark:text-white">{c.teacher}</span></p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Sections: {c.section}</p>
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setViewClass(c)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View</button>
          <button onClick={() => handleEdit(c)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Edit</button>
          <button onClick={() => { if (confirm('Delete this class?')) setClasses(classes.filter(x => x.id !== c.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-sm">Delete</button>
        </div>
      </div>)}
    </div>

    {viewClass && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewClass(null)}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{viewClass.name}</h3>
          <button onClick={() => setViewClass(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>
        <div className="space-y-2 text-sm mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <p><span className="font-medium">Teacher:</span> {viewClass.teacher}</p>
          <p><span className="font-medium">Sections:</span> {viewClass.section}</p>
          <p><span className="font-medium">Total Students:</span> {viewClass.students}</p>
          <p><span className="font-medium">Subjects:</span> {viewClass.subjects}</p>
        </div>
        <h4 className="font-semibold text-sm mb-2">All Students</h4>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {Array.from({ length: viewClass.students }, (_, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-700 dark:text-primary-300">
                {String.fromCharCode(65 + (i % 26))}
              </span>
              <span>Student {(i + 1).toString().padStart(3, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>}
  </div>
}
