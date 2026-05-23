import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const initialClassData = [
  { id: 1, class: 'Class 6', total: 112, present: 106, percentage: 94.6 },
  { id: 2, class: 'Class 7', total: 98, present: 89, percentage: 90.8 },
  { id: 3, class: 'Class 8', total: 134, present: 118, percentage: 88.1 },
  { id: 4, class: 'Class 9', total: 78, present: 72, percentage: 92.3 },
  { id: 5, class: 'Class 10', total: 112, present: 108, percentage: 96.4 }
]

export default function Attendance() {
  const navigate = useNavigate()
  const [date, setDate] = useState('2026-05-17')
  const [classData, setClassData] = useState(initialClassData)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ total: '', present: '' })

  const todayTotal = classData.reduce((s, c) => s + c.present, 0)
  const todayGrand = classData.reduce((s, c) => s + c.total, 0)
  const todayPercent = ((todayTotal / todayGrand) * 100).toFixed(1)

  const stats = [
    { label: "Today's Attendance", value: `${todayPercent}%`, change: `${todayTotal}/${todayGrand} students`, color: 'bg-green-500' },
    { label: 'Weekly Average', value: '93.2%', change: '+1.2% vs last week', color: 'bg-blue-500' },
    { label: 'Monthly Average', value: '91.8%', change: '-0.5% vs last month', color: 'bg-purple-500' },
    { label: 'Lowest Attendance', value: `${Math.min(...classData.map(c => c.percentage))}%`, change: classData.find(c => c.percentage === Math.min(...classData.map(c => c.percentage)))?.class, color: 'bg-orange-500' }
  ]

  const getStatus = (pct) => {
    if (pct >= 95) return { label: 'Excellent', class: 'badge-success' }
    if (pct >= 85) return { label: 'Good', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full' }
    if (pct >= 75) return { label: 'Average', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full' }
    return { label: 'Low', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-full' }
  }

  const handleEdit = (c) => {
    setEditId(c.id); setEditForm({ total: String(c.total), present: String(c.present) })
  }

  const handleSave = () => {
    if (!editForm.total || !editForm.present) return
    const total = Number(editForm.total), present = Number(editForm.present)
    const percentage = Math.round((present / total) * 1000) / 10
    setClassData(classData.map(c => c.id === editId ? { ...c, total, present, percentage } : c))
    setEditId(null); setEditForm({ total: '', present: '' })
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
            <h1 className="page-title">Attendance Overview</h1>
            <p className="page-subtitle">Monitor daily attendance across classes</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input type="date" className="input-field w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => alert('Attendance report generated!')} className="btn-primary">📋 Generate Report</button>
      </div>

      <div className="dashboard-grid mb-8">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-lg text-white`}>%</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs font-medium text-green-600">{s.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold mb-4">Class-wise Breakdown</h3>
          <div className="space-y-4">
            {classData.map((c) => {
              const status = getStatus(c.percentage)
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{c.class}</span>
                    <span className="text-gray-500 dark:text-gray-400">{c.present}/{c.total} ({c.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.percentage}%`, backgroundColor: c.percentage >= 95 ? '#22c55e' : c.percentage >= 85 ? '#3b82f6' : c.percentage >= 75 ? '#f97316' : '#ef4444' }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{todayPercent}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Today's Overall Attendance</p>
          </div>
          <div className="w-32 h-32 rounded-full border-8 border-primary-200 dark:border-primary-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary-600">{Math.round(todayPercent)}%</span>
          </div>
          <div className="text-center text-xs text-gray-400 dark:text-gray-500">{date} • {todayTotal} present out of {todayGrand}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Attendance Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Class</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Total Students</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Present</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Absent</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Percentage</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classData.map((c) => {
                const status = getStatus(c.percentage)
                return (
                  <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    {editId === c.id ? (
                      <>
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{c.class}</td>
                        <td className="py-3 text-right">
                          <input type="number" className="input-field w-20 text-xs inline-block" value={editForm.total} onChange={e => setEditForm({ ...editForm, total: e.target.value })} />
                        </td>
                        <td className="py-3 text-right">
                          <input type="number" className="input-field w-20 text-xs inline-block" value={editForm.present} onChange={e => setEditForm({ ...editForm, present: e.target.value })} />
                        </td>
                        <td className="py-3 text-right text-red-500">{Number(editForm.total) - Number(editForm.present)}</td>
                        <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">{editForm.total ? `${Math.round((Number(editForm.present) / Number(editForm.total)) * 1000) / 10}%` : '-'}</td>
                        <td className="py-3 text-right">{getStatus(editForm.total ? (Number(editForm.present) / Number(editForm.total)) * 100 : 0).label}</td>
                        <td className="py-3 text-right">
                          <button onClick={handleSave} className="text-green-600 dark:text-green-400 hover:underline text-xs mr-2">Save</button>
                          <button onClick={() => setEditId(null)} className="text-gray-600 dark:text-gray-400 hover:underline text-xs">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{c.class}</td>
                        <td className="py-3 text-right text-gray-600 dark:text-gray-400">{c.total}</td>
                        <td className="py-3 text-right text-green-600">{c.present}</td>
                        <td className="py-3 text-right text-red-500">{c.total - c.present}</td>
                        <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">{c.percentage}%</td>
                        <td className="py-3 text-right"><span className={status.class}>{status.label}</span></td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleEdit(c)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Edit</button>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
