import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialStudents = [
  { id: 1, name: 'Alice Johnson', class: '8', section: 'A', roll: '01', parent: 'Mr. Johnson', attendance: '95%', status: 'active' },
  { id: 2, name: 'Bob Williams', class: '8', section: 'A', roll: '02', parent: 'Mrs. Williams', attendance: '88%', status: 'active' },
  { id: 3, name: 'Charlie Brown', class: '8', section: 'B', roll: '01', parent: 'Mr. Brown', attendance: '72%', status: 'warning' },
  { id: 4, name: 'Diana Davis', class: '7', section: 'A', roll: '05', parent: 'Ms. Davis', attendance: '97%', status: 'active' },
  { id: 5, name: 'Eve Wilson', class: '7', section: 'B', roll: '03', parent: 'Mr. Wilson', attendance: '45%', status: 'inactive' },
  { id: 6, name: 'Frank Miller', class: '9', section: 'A', roll: '10', parent: 'Mrs. Miller', attendance: '91%', status: 'active' },
  { id: 7, name: 'Grace Taylor', class: '9', section: 'B', roll: '07', parent: 'Mr. Taylor', attendance: '68%', status: 'warning' },
  { id: 8, name: 'Henry Anderson', class: '6', section: 'A', roll: '04', parent: 'Mrs. Anderson', attendance: '99%', status: 'active' }
]

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [viewStudent, setViewStudent] = useState(null)
  const [form, setForm] = useState({ name: '', class: '', section: '', roll: '', parent: '', attendance: '', status: 'active' })

  const resetForm = () => setForm({ name: '', class: '', section: '', roll: '', parent: '', attendance: '', status: 'active' })

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.class.includes(search) || s.section.toLowerCase().includes(search.toLowerCase()) || s.parent.toLowerCase().includes(search.toLowerCase())
    const matchClass = !classFilter || s.class === classFilter
    const matchStatus = !statusFilter || s.status === statusFilter
    return matchSearch && matchClass && matchStatus
  })

  const handleSubmit = () => {
    if (!form.name || !form.class) return
    if (editId) {
      setStudents(students.map(s => s.id === editId ? { ...s, ...form } : s))
      setEditId(null)
    } else {
      setStudents([...students, { id: Date.now(), ...form }])
    }
    resetForm(); setShowForm(false)
  }

  const handleEdit = (s) => {
    setEditId(s.id); setForm({ name: s.name, class: s.class, section: s.section, roll: s.roll, parent: s.parent, attendance: s.attendance, status: s.status })
    setShowForm(true)
  }

  const statusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="badge-success">Active</span>
      case 'warning': return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full">Warning</span>
      case 'inactive': return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-full">Inactive</span>
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
            <h1 className="page-title">Students</h1>
            <p className="page-subtitle">Manage student records ({students.length} total)</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditId(null); resetForm() } }} className="btn-primary">➕ Add Student</button>
        {showForm && <button onClick={() => { setShowForm(false); setEditId(null); resetForm() }} className="btn-outline">Cancel</button>}
      </div>

      {showForm && <div className="card mb-6 p-4">
        <h3 className="font-semibold mb-4">{editId ? 'Edit Student' : 'New Student'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Full name" />
          <input value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="input-field" placeholder="Class" />
          <input value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="input-field" placeholder="Section" />
          <input value={form.roll} onChange={e => setForm({ ...form, roll: e.target.value })} className="input-field" placeholder="Roll No." />
          <input value={form.parent} onChange={e => setForm({ ...form, parent: e.target.value })} className="input-field" placeholder="Parent name" />
          <input value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} className="input-field" placeholder="Attendance %" />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field">
            <option value="active">Active</option>
            <option value="warning">Warning</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="btn-primary mt-3">{editId ? 'Update' : 'Add'} Student</button>
      </div>}

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Search students by name, class, section, parent..." className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field w-auto" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
          </select>
          <select className="input-field w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="warning">Warning</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Class</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Section</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Roll No.</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Parent</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Attendance</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
                      <button onClick={() => setViewStudent(s)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{s.class}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{s.section}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{s.roll}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{s.parent}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${parseInt(s.attendance) >= 90 ? 'bg-green-500' : parseInt(s.attendance) >= 75 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: s.attendance }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{s.attendance}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">{statusBadge(s.status)}</td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => setViewStudent(s)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium mr-2">View</button>
                    <button onClick={() => handleEdit(s)} className="text-primary-600 hover:text-primary-800 text-xs font-medium mr-2">Edit</button>
                    <button onClick={() => { if (confirm('Delete this student?')) setStudents(students.filter(x => x.id !== s.id)) }} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">No students found matching your search.</div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing {filtered.length} of {students.length} students</p>
        </div>
      </div>

      {viewStudent && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewStudent(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewStudent.name}</h3>
            <button onClick={() => setViewStudent(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Class:</span> {viewStudent.class}</p>
            <p><span className="font-medium">Section:</span> {viewStudent.section}</p>
            <p><span className="font-medium">Roll No.:</span> {viewStudent.roll}</p>
            <p><span className="font-medium">Parent:</span> {viewStudent.parent}</p>
            <p><span className="font-medium">Attendance:</span> {viewStudent.attendance}</p>
            <p><span className="font-medium">Status:</span> {statusBadge(viewStudent.status)}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
