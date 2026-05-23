import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Moderation() {
  const navigate = useNavigate()
  const [flagged, setFlagged] = useState([
    { id: 1, content: 'Inappropriate comment on homework post', author: 'Student - Alice Johnson', type: 'Comment', date: '2026-05-16', status: 'pending', reportedBy: 'Teacher - Ms. Johnson' },
    { id: 2, content: 'Bullying message in class group chat', author: 'Student - Bob Williams', type: 'Message', date: '2026-05-15', status: 'pending', reportedBy: 'Student - Diana Davis' },
    { id: 3, content: 'Shared unrelated links in study group', author: 'Student - Charlie Brown', type: 'Post', date: '2026-05-14', status: 'resolved', reportedBy: 'Moderator - System' },
    { id: 4, content: 'Fake profile using teacher name', author: 'Unknown User', type: 'Profile', date: '2026-05-13', status: 'pending', reportedBy: 'Admin - Principal' },
    { id: 5, content: 'Spam messages in announcements', author: 'Student - Eve Wilson', type: 'Message', date: '2026-05-12', status: 'dismissed', reportedBy: 'Teacher - Mrs. Davis' }
  ])
  const [filters, setFilters] = useState([
    { word: 'spam', action: 'flag', addedBy: 'System' },
    { word: 'inappropriate', action: 'block', addedBy: 'Admin' },
    { word: 'bully', action: 'flag', addedBy: 'Principal' },
    { word: 'harassment', action: 'block', addedBy: 'Admin' },
    { word: 'profanity1', action: 'block', addedBy: 'System' },
    { word: 'profanity2', action: 'block', addedBy: 'System' }
  ])
  const [logs] = useState([
    { id: 1, action: 'Flagged content reviewed - dismissed', moderator: 'Admin', target: 'Eve Wilson', date: '2026-05-13' },
    { id: 2, action: 'User warned for inappropriate behavior', moderator: 'Principal', target: 'Bob Williams', date: '2026-05-12' },
    { id: 3, action: 'Content removed - violation of policy', moderator: 'Admin', target: 'Charlie Brown', date: '2026-05-11' },
    { id: 4, action: 'Word filter updated - added 3 new terms', moderator: 'Admin', target: 'System', date: '2026-05-10' },
    { id: 5, action: 'Account temporarily suspended', moderator: 'Principal', target: 'Unknown User', date: '2026-05-09' }
  ])
  const [viewFlagged, setViewFlagged] = useState(null)
  const [showFilterForm, setShowFilterForm] = useState(false)
  const [filterForm, setFilterForm] = useState({ word: '', action: 'flag' })

  const statusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full">Pending</span>
      case 'resolved': return <span className="badge-success">Resolved</span>
      case 'dismissed': return <span className="bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400 text-xs font-medium px-2.5 py-1 rounded-full">Dismissed</span>
      default: return null
    }
  }

  const updateStatus = (id, status) => {
    setFlagged(flagged.map(f => f.id === id ? { ...f, status } : f))
  }

  const addFilter = () => {
    if (!filterForm.word) return
    setFilters([...filters, { word: filterForm.word, action: filterForm.action, addedBy: 'Admin' }])
    setFilterForm({ word: '', action: 'flag' }); setShowFilterForm(false)
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
            <h1 className="page-title">Moderation</h1>
            <p className="page-subtitle">Review flagged content and manage filters</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Reviews</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{flagged.filter(f => f.status === 'pending').length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Filters</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{filters.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actions Taken (30d)</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Flagged Content</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Content</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Author</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Reported By</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flagged.map(f => (
                <tr key={f.id} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3 max-w-xs truncate">
                    <button onClick={() => setViewFlagged(f)} className="text-blue-600 dark:text-blue-400 hover:underline text-left">{f.content}</button>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400 text-xs">{f.author}</td>
                  <td className="py-3"><span className="text-xs bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{f.type}</span></td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{f.date}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{f.reportedBy}</td>
                  <td className="py-3">{statusBadge(f.status)}</td>
                  <td className="py-3 text-right">
                    {f.status === 'pending' ? (
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => updateStatus(f.id, 'resolved')} className="text-green-600 dark:text-green-400 hover:underline text-xs font-medium mr-2">Resolve</button>
                        <button onClick={() => updateStatus(f.id, 'dismissed')} className="text-gray-500 dark:text-gray-400 hover:underline text-xs font-medium">Dismiss</button>
                      </div>
                    ) : (
                      <button onClick={() => updateStatus(f.id, 'pending')} className="text-orange-600 dark:text-orange-400 hover:underline text-xs">Reopen</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Word Filter Settings</h3>
            <button onClick={() => setShowFilterForm(!showFilterForm)} className="btn-ghost text-xs">+ Add Filter</button>
          </div>
          {showFilterForm && <div className="flex gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <input value={filterForm.word} onChange={e => setFilterForm({ ...filterForm, word: e.target.value })} className="input-field text-xs flex-1" placeholder="Word or phrase" />
            <select value={filterForm.action} onChange={e => setFilterForm({ ...filterForm, action: e.target.value })} className="input-field text-xs w-auto">
              <option value="flag">Flag</option>
              <option value="block">Block</option>
            </select>
            <button onClick={addFilter} className="btn-primary text-xs">Add</button>
            <button onClick={() => setShowFilterForm(false)} className="btn-outline text-xs">Cancel</button>
          </div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Word/Phrase</th>
                  <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Action</th>
                  <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Added By</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {filters.map((f, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 font-mono text-sm text-gray-900 dark:text-white">{f.word}</td>
                    <td className="py-3">
                      {f.action === 'block'
                        ? <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded">Block</span>
                        : <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium px-2 py-0.5 rounded">Flag</span>
                      }
                    </td>
                    <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{f.addedBy}</td>
                    <td className="py-3 text-right"><button onClick={() => setFilters(filters.filter((_, idx) => idx !== i))} className="text-red-500 dark:text-red-400 hover:underline text-xs">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Moderation Logs</h3>
          <div className="space-y-3">
            {logs.map(l => (
              <div key={l.id} className="flex items-start gap-3 text-sm pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">👤</div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">{l.action}</p>
                  <div className="flex gap-3 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    <span>by {l.moderator}</span>
                    <span>→ {l.target}</span>
                    <span>{l.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {viewFlagged && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewFlagged(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Flagged Content</h3>
            <button onClick={() => setViewFlagged(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Content:</span> {viewFlagged.content}</p>
            <p><span className="font-medium">Author:</span> {viewFlagged.author}</p>
            <p><span className="font-medium">Type:</span> {viewFlagged.type}</p>
            <p><span className="font-medium">Date:</span> {viewFlagged.date}</p>
            <p><span className="font-medium">Reported By:</span> {viewFlagged.reportedBy}</p>
            <p><span className="font-medium">Status:</span> {statusBadge(viewFlagged.status)}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
