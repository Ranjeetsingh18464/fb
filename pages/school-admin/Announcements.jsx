import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Announcements() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', audience: 'all', targetClass: '', targetSection: '', priority: 'normal' })
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'School Closed on May 20', content: 'The school will remain closed due to local elections.', audience: 'All', targetClass: '', targetSection: '', priority: 'high', date: '2026-05-14', author: 'Principal' },
    { id: 2, title: 'PTA Meeting Rescheduled', content: 'The PTA meeting has been moved to June 2nd at 3 PM.', audience: 'Parents', targetClass: '', targetSection: '', priority: 'normal', date: '2026-05-12', author: 'Admin' },
    { id: 3, title: 'Summer Camp Registration Open', content: 'Registration for summer camp is now open until May 30th.', audience: 'All', targetClass: '', targetSection: '', priority: 'normal', date: '2026-05-10', author: 'Activities Dept' },
    { id: 4, title: 'Exam Schedule Released', content: 'Final exam schedule for Classes 6-10 has been published.', audience: 'Students', targetClass: '6,7,8,9,10', targetSection: '', priority: 'high', date: '2026-05-08', author: 'Academics' },
    { id: 5, title: 'Library Timings Updated', content: 'Library will now remain open until 5 PM on weekdays.', audience: 'Teachers', targetClass: '', targetSection: '', priority: 'low', date: '2026-05-05', author: 'Librarian' }
  ])
  const [editId, setEditId] = useState(null)
  const [viewAnn, setViewAnn] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const resetForm = () => setForm({ title: '', content: '', audience: 'all', targetClass: '', targetSection: '', priority: 'normal' })

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded">High</span>
      case 'normal': return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium px-2 py-0.5 rounded">Normal</span>
      case 'low': return <span className="bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded">Low</span>
      default: return null
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.content) return
    if (editId) {
      setAnnouncements(announcements.map(a => a.id === editId ? { ...a, title: form.title, content: form.content, audience: form.audience.charAt(0).toUpperCase() + form.audience.slice(1), targetClass: form.targetClass, targetSection: form.targetSection, priority: form.priority } : a))
      setEditId(null)
    } else {
      setAnnouncements(prev => [{ id: Date.now(), title: form.title, content: form.content, audience: form.audience.charAt(0).toUpperCase() + form.audience.slice(1), targetClass: form.targetClass, targetSection: form.targetSection, priority: form.priority, date: new Date().toISOString().split('T')[0], author: 'You' }, ...prev])
    }
    resetForm(); setShowForm(false)
  }

  const handleEdit = (a) => {
    setEditId(a.id); setForm({ title: a.title, content: a.content, audience: a.audience.toLowerCase(), targetClass: a.targetClass, targetSection: a.targetSection, priority: a.priority }); setShowForm(true)
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
            <h1 className="page-title">Announcements</h1>
            <p className="page-subtitle">Create and manage school announcements</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditId(null); resetForm() } }} className="btn-primary">📢 Create Announcement</button>
        {showForm && <button onClick={() => { setShowForm(false); setEditId(null); resetForm() }} className="btn-outline">Cancel</button>}
      </div>

      {showForm && <div className="card mb-6 p-4">
        <h3 className="font-semibold mb-4">{editId ? 'Edit Announcement' : 'Create Announcement'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input type="text" className="input-field" placeholder="Announcement title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
              <select className="input-field" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                <option value="all">All</option>
                <option value="parents">Parents</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Class (optional)</label>
              <select className="input-field" value={form.targetClass} onChange={(e) => setForm({ ...form, targetClass: e.target.value })}>
                <option value="">All Classes</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Section (optional)</label>
              <select className="input-field" value={form.targetSection} onChange={(e) => setForm({ ...form, targetSection: e.target.value })}>
                <option value="">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea className="input-field min-h-[100px]" placeholder="Announcement details..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}></textarea>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700 dark:text-gray-300">Priority:</label>
              {['low', 'normal', 'high'].map(p => (
                <label key={p} className="flex items-center gap-1.5 text-sm">
                  <input type="radio" name="priority" className="accent-primary-600" checked={form.priority === p} onChange={() => setForm({ ...form, priority: p })} />
                  <span className="capitalize text-gray-600 dark:text-gray-400">{p}</span>
                </label>
              ))}
            </div>
            <button type="submit" className="btn-primary">{editId ? 'Update' : '📢 Publish'} Announcement</button>
          </div>
        </form>
      </div>}

      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.id} className="card">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                {getPriorityBadge(a.priority)}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{a.date}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{a.content}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-3">
              <span>🎯 {a.audience}</span>
              {a.targetClass && <span>📚 Class {a.targetClass}{a.targetSection ? `-${a.targetSection}` : ''}</span>}
              <span>✍️ {a.author}</span>
            </div>
            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setViewAnn(a)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View</button>
              <button onClick={() => handleEdit(a)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Edit</button>
              <button onClick={() => { if (confirm('Delete this announcement?')) setAnnouncements(announcements.filter(x => x.id !== a.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {viewAnn && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewAnn(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewAnn.title}</h3>
            <button onClick={() => setViewAnn(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{viewAnn.content}</p>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Audience:</span> {viewAnn.audience}</p>
            {viewAnn.targetClass && <p><span className="font-medium">Class:</span> {viewAnn.targetClass}{viewAnn.targetSection ? `-${viewAnn.targetSection}` : ''}</p>}
            <p><span className="font-medium">Priority:</span> {getPriorityBadge(viewAnn.priority)}</p>
            <p><span className="font-medium">Date:</span> {viewAnn.date}</p>
            <p><span className="font-medium">Author:</span> {viewAnn.author}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
