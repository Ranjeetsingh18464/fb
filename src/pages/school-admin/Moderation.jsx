import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, updateDoc, deleteDoc } from '../../services/firebase'

export default function Moderation() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => { fetchReports() }, [])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'reports'))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setReports(list)
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'reports', id), { status })
      setReports(reports.map(r => r.id === id ? { ...r, status } : r))
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reported item?')) return
    try {
      await deleteDoc(doc(db, 'reports', id))
      setReports(reports.filter(r => r.id !== id))
    } catch (err) {
      console.error('Failed to delete report:', err)
    }
  }

  const statusColor = { Pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900', Approved: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900', Rejected: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900' }

  const filtered = reports.filter(r => {
    if (filterType !== 'All' && r.type !== filterType) return false
    if (filterStatus !== 'All' && r.status !== filterStatus) return false
    return true
  })

  const pendingCount = filtered.filter(r => r.status === 'Pending').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">← Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Moderation Queue</h1>
          {pendingCount > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">{pendingCount} pending</span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="All">All Types</option>
            <option value="Post">Post</option>
            <option value="Comment">Comment</option>
            <option value="Profile">Profile</option>
            <option value="Media">Media</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Content</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Reported By</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">No reports match the filters.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{r.content}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.reportedBy}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'Pending' && (
                      <>
                        <button onClick={() => updateStatus(r.id, 'Approved')} className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-xs hover:bg-green-200 dark:hover:bg-green-800 transition mr-1">Approve</button>
                        <button onClick={() => updateStatus(r.id, 'Rejected')} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition mr-1">Reject</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
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
