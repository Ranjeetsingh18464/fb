import { useState } from 'react'

const genCode = (schools, prefix) => {
  const nums = schools.map(s => parseInt((s.schoolId || s.code || '').replace(prefix, '')) || 0)
  const next = Math.max(0, ...nums) + 1
  return `${prefix}${String(next).padStart(3, '0')}`
}

const initialSchools = [
  { id: 1, name: 'Delhi Public School', schoolId: 'SCH-001', adminId: 'ADM-001', adminName: 'Ravi Verma', principal: 'Dr. Ravi Verma', adminEmail: 'admin@dps.edu', adminPassword: 'dps@123', phone: '9876543210', plan: 'Premium', address: 'Mathura Road, Delhi', active: true, createdBy: 'Ananya Sharma', createdAt: '15-01-2025' },
  { id: 2, name: 'Springfields Academy', schoolId: 'SCH-002', adminId: 'ADM-002', adminName: 'Anita Sharma', principal: 'Ms. Anita Sharma', adminEmail: 'admin@springfields.in', adminPassword: 'spring@123', phone: '9876543211', plan: 'Standard', address: 'MG Road, Bangalore', active: true, createdBy: 'Ananya Sharma', createdAt: '03-03-2025' },
  { id: 3, name: 'St. Mary\'s Convent', schoolId: 'SCH-003', adminId: 'ADM-003', adminName: 'Joseph D\'Souza', principal: 'Fr. Joseph D\'Souza', adminEmail: 'contact@stmarys.edu', adminPassword: 'stmary@123', phone: '9876543212', plan: 'Basic', address: 'Mall Road, Shimla', active: false, createdBy: 'Rahul Verma', createdAt: '22-06-2025' },
]

export default function Schools() {
  const [schools, setSchools] = useState(initialSchools)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', adminName: '', principal: '', adminEmail: '', adminPassword: '', phone: '', plan: 'No Plan', address: '', active: true, createdBy: 'Ananya Sharma' })

  const toggleStatus = (id) => {
    setSchools(schools.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.principal) return
    if (editing) {
      setSchools(schools.map((s) => (s.id === editing.id ? { ...s, ...form } : s)))
      setEditing(null)
    } else {
      setSchools([...schools, { id: Date.now(), schoolId: genCode(schools, 'SCH-'), adminId: genCode(schools, 'ADM-'), createdBy: 'Ananya Sharma', createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'), ...form }])
    }
    setForm({ name: '', adminName: '', principal: '', adminEmail: '', adminPassword: '', phone: '', plan: 'No Plan', address: '', active: true, createdBy: 'Ananya Sharma' })
    setShowForm(false)
  }

  const startEdit = (school) => {
    setEditing(school)
    setForm({ name: school.name, adminName: school.adminName, principal: school.principal, adminEmail: school.adminEmail, adminPassword: school.adminPassword, phone: school.phone, plan: school.plan, address: school.address, active: school.active, createdBy: school.createdBy })
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ name: '', adminName: '', principal: '', adminEmail: '', adminPassword: '', phone: '', plan: 'No Plan', address: '', active: true, createdBy: 'Ananya Sharma' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Schools</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ Add School'}
          </button>
        </div>

        {showForm && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New School</h2>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School ID</label>
                  <input type="text" value={editing ? editing.schoolId : genCode(schools, 'SCH-')} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin ID</label>
                  <input type="text" value={editing ? editing.adminId : genCode(schools, 'ADM-')} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter admin name" value={form.adminName} onChange={e => setForm({ ...form, adminName: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter school name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Principal Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter principal name" value={form.principal} onChange={e => setForm({ ...form, principal: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Email</label>
                  <input type="email" placeholder="ramlal@gmail.com" value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} placeholder="••••••" value={form.adminPassword} onChange={e => setForm({ ...form, adminPassword: e.target.value })} className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">{showPw ? '🙈' : '👁️'}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input type="text" placeholder="Contact number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subscription Plan</label>
                  <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {['No Plan', 'Basic', 'Standard', 'Premium'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={form.active ? 'Active' : 'Inactive'} onChange={e => setForm({ ...form, active: e.target.value === 'Active' })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created By</label>
                  <select value={form.createdBy} onChange={e => setForm({ ...form, createdBy: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {['Ananya Sharma', 'Rahul Verma', 'Priya Kapoor', 'Neha Gupta'].map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created At</label>
                  <input type="text" value={editing ? editing.createdAt : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea rows="2" placeholder="School address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">{editing ? 'Update School' : 'Create School'}</button>
                <button type="button" onClick={cancelForm} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">School ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Admin ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Principal</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {schools.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{s.schoolId}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{s.adminId}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.principal}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.adminEmail}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.phone}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${s.plan === 'Premium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : s.plan === 'Standard' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : s.plan === 'Basic' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : 'text-gray-400'}`}>{s.plan}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(s.id)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${s.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{s.active ? 'Active' : 'Inactive'}</button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => startEdit(s)} className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
