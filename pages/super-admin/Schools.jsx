import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Schools() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const schools = [
    { id: 1, name: 'Springfield High School', code: 'SPR001', users: 1240, plan: 'Premium', status: 'active', verified: true },
    { id: 2, name: 'Riverside Academy', code: 'RIV002', users: 892, plan: 'Standard', status: 'active', verified: true },
    { id: 3, name: 'Hillside Public School', code: 'HIL003', users: 2156, plan: 'Enterprise', status: 'active', verified: true },
    { id: 4, name: 'Valley View School', code: 'VAL004', users: 567, plan: 'Basic', status: 'pending', verified: false },
    { id: 5, name: 'Sunrise International', code: 'SUN005', users: 3451, plan: 'Enterprise', status: 'active', verified: true }
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Schools</h1>
          <p className="page-subtitle">Manage all registered schools ({schools.length})</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">➕ Add School</button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search schools..." />
          </div>
          <select className="input-field w-auto"><option>All Plans</option><option>Basic</option><option>Standard</option><option>Premium</option><option>Enterprise</option></select>
          <select className="input-field w-auto"><option>All Status</option><option>Active</option><option>Pending</option><option>Suspended</option></select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="p-4 font-medium">School</th>
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Users</th>
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Verified</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {schools.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{s.name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{s.code}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{s.users.toLocaleString()}</td>
                  <td className="p-4"><span className={`badge-${s.plan === 'Premium' ? 'primary' : s.plan === 'Enterprise' ? 'success' : s.plan === 'Standard' ? 'warning' : 'badge'}`}>{s.plan}</span></td>
                  <td className="p-4">{s.verified ? <span className="text-green-600 font-medium">✓ Verified</span> : <span className="text-yellow-600">Pending</span>}</td>
                  <td className="p-4"><span className={`badge-${s.status === 'active' ? 'success' : s.status === 'pending' ? 'warning' : 'danger'}`}>{s.status}</span></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="btn-ghost text-xs py-1 px-2">Edit</button>
                      <button className="btn-ghost text-xs py-1 px-2 text-danger-600">Suspend</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
