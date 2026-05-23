import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialHomework = [
  { id: 1, title: 'Algebra Practice', description: 'Solve exercise 5.1 from the textbook', class: '8', section: 'A', subject: 'Mathematics', teacher: 'Ms. Johnson', dueDate: '2026-05-20', status: 'active', submitted: 28, total: 36 },
  { id: 2, title: 'Chemical Reactions', description: 'Write balanced equations for chapter 4', class: '8', section: 'B', subject: 'Science', teacher: 'Mr. Williams', dueDate: '2026-05-21', status: 'active', submitted: 15, total: 32 },
  { id: 3, title: 'Essay on Climate', description: 'Write 500 words on climate change', class: '7', section: 'A', subject: 'English', teacher: 'Mrs. Davis', dueDate: '2026-05-19', status: 'overdue', submitted: 30, total: 30 },
  { id: 4, title: 'World War II Notes', description: 'Read chapter 6 and summarize key events', class: '9', section: 'A', subject: 'History', teacher: 'Mr. Brown', dueDate: '2026-05-22', status: 'active', submitted: 12, total: 40 },
  { id: 5, title: 'Multiplication Tables', description: 'Practice tables 12 to 20', class: '6', section: 'A', subject: 'Mathematics', teacher: 'Ms. Wilson', dueDate: '2026-05-18', status: 'overdue', submitted: 28, total: 38 },
  { id: 6, title: 'Newton\'s Laws', description: 'Read and write examples for each law', class: '10', section: 'A', subject: 'Physics', teacher: 'Mr. Taylor', dueDate: '2026-05-25', status: 'draft', submitted: 0, total: 34 }
]

export default function Homework() {
  const navigate = useNavigate()
  const [homework, setHomework] = useState(initialHomework)
  const [filters, setFilters] = useState({ class: '', section: '', subject: '', date: '' })
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [viewHw, setViewHw] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', class: '6', section: 'A', subject: '', teacher: '', dueDate: '', status: 'active', total: '' })

  const resetForm = () => setForm({ title: '', description: '', class: '6', section: 'A', subject: '', teacher: '', dueDate: '', status: 'active', total: '' })

  const filtered = homework.filter(h =>
    (!filters.class || h.class === filters.class) &&
    (!filters.section || h.section === filters.section) &&
    (!filters.subject || h.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
    (!filters.date || h.dueDate === filters.date)
  )

  const handleSubmit = () => {
    if (!form.subject || !form.teacher) return
    if (editId) {
      setHomework(homework.map(h => h.id === editId ? { ...h, ...form, total: Number(form.total), submitted: Number(form.submitted) || 0 } : h))
      setEditId(null)
    } else {
      setHomework([...homework, { id: Date.now(), ...form, total: Number(form.total), submitted: 0 }])
    }
    resetForm(); setShowForm(false)
  }

  const handleEdit = (h) => {
    setEditId(h.id); setForm({ title: h.title, description: h.description, class: h.class, section: h.section, subject: h.subject, teacher: h.teacher, dueDate: h.dueDate, status: h.status, total: String(h.total) })
    setShowForm(true)
  }

  const statusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="badge-success">Active</span>
      case 'overdue': return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-full">Overdue</span>
      case 'draft': return <span className="bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400 text-xs font-medium px-2.5 py-1 rounded-full">Draft</span>
      default: return null
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/school_admin')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="page-title">Homework Monitoring</h1>
            <p className="page-subtitle">Track and manage homework assignments</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditId(null); resetForm() } }} className="btn-primary">📝 Assign Homework</button>
        {showForm && <button onClick={() => { setShowForm(false); setEditId(null); resetForm() }} className="btn-outline">Cancel</button>}
      </div>

      {showForm && <div className="card mb-6 p-4">
        <h3 className="font-semibold mb-4">{editId ? 'Edit Homework' : 'Assign New Homework'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field md:col-span-2" placeholder="Title" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field md:col-span-4" placeholder="Description" rows={2} />
          <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="input-field">
            <option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option>
          </select>
          <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="input-field">
            <option value="A">A</option><option value="B">B</option><option value="C">C</option>
          </select>
          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="Subject" />
          <input value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} className="input-field" placeholder="Teacher name" />
          <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="input-field" />
          <input type="number" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} className="input-field" placeholder="Total students" />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field">
            <option value="active">Active</option><option value="overdue">Overdue</option><option value="draft">Draft</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="btn-primary mt-3">{editId ? 'Update' : 'Assign'} Homework</button>
      </div>}

      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select className="input-field w-auto" value={filters.class} onChange={(e) => setFilters(p => ({ ...p, class: e.target.value }))}>
            <option value="">All Classes</option>
            <option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option>
          </select>
          <select className="input-field w-auto" value={filters.section} onChange={(e) => setFilters(p => ({ ...p, section: e.target.value }))}>
            <option value="">All Sections</option>
            <option value="A">A</option><option value="B">B</option><option value="C">C</option>
          </select>
          <input type="text" placeholder="Subject..." className="input-field w-auto" value={filters.subject} onChange={(e) => setFilters(p => ({ ...p, subject: e.target.value }))} />
          <input type="date" className="input-field w-auto" value={filters.date} onChange={(e) => setFilters(p => ({ ...p, date: e.target.value }))} />
          <button className="btn-ghost text-sm" onClick={() => setFilters({ class: '', section: '', subject: '', date: '' })}>Clear Filters</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(h => (
          <div key={h.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{h.title}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/30 px-2 py-0.5 rounded">{h.class}{h.section}</span>
                  {statusBadge(h.status)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{h.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>👨‍🏫 {h.teacher} • {h.subject}</span>
                  <span>📅 Due: {h.dueDate}</span>
                </div>
                <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => setViewHw(h)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View</button>
                  <button onClick={() => handleEdit(h)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Edit</button>
                  <button onClick={() => { if (confirm('Delete this homework?')) setHomework(homework.filter(x => x.id !== h.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-sm">Delete</button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Submissions</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{h.submitted}/{h.total}</p>
                <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(h.submitted / h.total) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">No homework entries match your filters.</div>
      )}

      {viewHw && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewHw(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewHw.title}</h3>
            <button onClick={() => setViewHw(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{viewHw.description}</p>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Subject:</span> {viewHw.subject}</p>
            <p><span className="font-medium">Class:</span> {viewHw.class}{viewHw.section}</p>
            <p><span className="font-medium">Teacher:</span> {viewHw.teacher}</p>
            <p><span className="font-medium">Due Date:</span> {viewHw.dueDate}</p>
            <p><span className="font-medium">Status:</span> {statusBadge(viewHw.status)}</p>
            <p><span className="font-medium">Submissions:</span> {viewHw.submitted}/{viewHw.total}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
