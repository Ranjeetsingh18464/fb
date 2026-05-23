export default function Moderation() {
  const reports = [
    { id: 1, type: 'Flagged Post', reporter: 'Teacher Smith', content: 'Inappropriate language in group discussion', status: 'pending', date: '2h ago' },
    { id: 2, type: 'Abuse Report', reporter: 'Student Jane', content: 'Bullying comment on achievement post', status: 'reviewing', date: '5h ago' },
    { id: 3, type: 'Spam', reporter: 'Auto-detected', content: 'Multiple duplicate homework submissions', status: 'resolved', date: '1d ago' }
  ]
  return <div className="page-container">
    <div className="page-header">
      <div><h1 className="page-title">Content Moderation</h1><p className="page-subtitle">Monitor and manage platform content safety</p></div>
      <div className="flex gap-2"><button className="btn-primary">⚙️ Moderation Settings</button></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Pending Reports', value: '23', color: 'text-yellow-600' },
        { label: 'Resolved Today', value: '47', color: 'text-green-600' },
        { label: 'Flagged Content', value: '156', color: 'text-red-600' },
        { label: 'Blocked Words', value: '89', color: 'text-blue-600' }
      ].map((s, i) => <div key={i} className="card text-center"><p className={`text-3xl font-bold ${s.color}`}>{s.value}</p><p className="text-sm text-gray-500 mt-1">{s.label}</p></div>)}
    </div>
    <div className="card"><h3 className="font-semibold mb-4">Recent Reports</h3><div className="space-y-3">{reports.map((r, i) => <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"><div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${r.status === 'pending' ? 'bg-yellow-500' : r.status === 'reviewing' ? 'bg-blue-500' : 'bg-green-500'}`} /><div className="flex-1"><div className="flex justify-between"><p className="font-medium text-sm text-gray-900 dark:text-white">{r.type}</p><span className="text-xs text-gray-400">{r.date}</span></div><p className="text-xs text-gray-500">{r.reporter}</p><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.content}</p></div><span className={`badge-${r.status === 'resolved' ? 'success' : r.status === 'reviewing' ? 'primary' : 'warning'} text-xs`}>{r.status}</span></div>)}</div></div>
  </div>
}
