import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialParents = [
  { id: 1, name: 'Mr. John Johnson', children: ['Alice Johnson (8A)'], contact: '+1 234-567-8901', email: 'john.j@email.com', status: 'active' },
  { id: 2, name: 'Mrs. Sarah Williams', children: ['Bob Williams (8A)', 'Emma Williams (6B)'], contact: '+1 234-567-8902', email: 'sarah.w@email.com', status: 'active' },
  { id: 3, name: 'Mr. David Brown', children: ['Charlie Brown (8B)'], contact: '+1 234-567-8903', email: 'david.b@email.com', status: 'active' },
  { id: 4, name: 'Ms. Lisa Davis', children: ['Diana Davis (7A)', 'Mike Davis (5C)'], contact: '+1 234-567-8904', email: 'lisa.d@email.com', status: 'inactive' },
  { id: 5, name: 'Mr. Robert Wilson', children: ['Eve Wilson (7B)'], contact: '+1 234-567-8905', email: 'robert.w@email.com', status: 'active' },
  { id: 6, name: 'Mrs. Jennifer Miller', children: ['Frank Miller (9A)', 'Sophie Miller (9A)'], contact: '+1 234-567-8906', email: 'jennifer.m@email.com', status: 'active' }
]

export default function Parents() {
  const navigate = useNavigate()
  const [parents, setParents] = useState(initialParents)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [viewParent, setViewParent] = useState(null)
  const [form, setForm] = useState({ name: '', children: '', contact: '', email: '', status: 'active' })

  const resetForm = () => setForm({ name: '', children: '', contact: '', email: '', status: 'active' })

  const handleSubmit = () => {
    if (!form.name) return
    if (editId) {
      setParents(parents.map(p => p.id === editId ? { ...p, ...form, children: form.children.split(',').map(c => c.trim()) } : p))
      setEditId(null)
    } else {
      setParents([...parents, { id: Date.now(), ...form, children: form.children.split(',').map(c => c.trim()) }])
    }
    resetForm(); setShowForm(false)
  }

  const handleEdit = (p) => {
    setEditId(p.id); setForm({ name: p.name, children: p.children.join(', '), contact: p.contact, email: p.email, status: p.status })
    setShowForm(true)
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
            <h1 className="page-title">Parents</h1>
            <p className="page-subtitle">Manage parent and guardian records ({parents.length} total)</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditId(null); resetForm() } }} className="btn-primary">➕ Add Parent</button>
        {showForm && <button onClick={() => { setShowForm(false); setEditId(null); resetForm() }} className="btn-outline">Cancel</button>}
      </div>

      {showForm && <div className="card mb-6 p-4">
        <h3 className="font-semibold mb-4">{editId ? 'Edit Parent' : 'New Parent'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Full name" />
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="Email" />
          <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="input-field" placeholder="Contact number" />
          <div className="md:col-span-2">
            <input value={form.children} onChange={e => setForm({ ...form, children: e.target.value })} className="input-field" placeholder="Children (comma separated, e.g. Alice (8A), Bob (8B))" />
          </div>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="btn-primary mt-3">{editId ? 'Update' : 'Add'} Parent</button>
      </div>}

      <div className="grid grid-cols-1 gap-4">
        {parents.map((p) => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-lg font-bold text-primary-600">
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{p.name}</h3>
                    <button onClick={() => setViewParent(p)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{p.email}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">|</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{p.contact}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={p.status === 'active' ? 'badge-success' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-full'}>
                  {p.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="mt-3 pl-16">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Linked Children:</p>
              <div className="flex flex-wrap gap-2">
                {p.children.map((child, ci) => (
                  <span key={ci} className="bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 text-xs px-2.5 py-1 rounded-full">{child}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setViewParent(p)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View</button>
              <button onClick={() => handleEdit(p)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Edit</button>
              <button onClick={() => { if (confirm('Remove this parent?')) setParents(parents.filter(x => x.id !== p.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {viewParent && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewParent(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewParent.name}</h3>
            <button onClick={() => setViewParent(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <div className="space-y-3 text-sm">
            <p><span className="font-medium">Email:</span> {viewParent.email}</p>
            <p><span className="font-medium">Contact:</span> {viewParent.contact}</p>
            <p><span className="font-medium">Status:</span> <span className={viewParent.status === 'active' ? 'badge-success' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-full'}>{viewParent.status === 'active' ? 'Active' : 'Inactive'}</span></p>
            <div>
              <p className="font-medium mb-1">Linked Children:</p>
              <div className="flex flex-wrap gap-2">
                {viewParent.children.map((child, ci) => (
                  <span key={ci} className="bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 text-xs px-2.5 py-1 rounded-full">{child}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}
