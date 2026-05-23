export default function System() {
  const services = [
    { name: 'Authentication', status: 'operational', uptime: '99.99%' },
    { name: 'Firestore Database', status: 'operational', uptime: '99.97%' },
    { name: 'Storage', status: 'operational', uptime: '99.95%' },
    { name: 'Cloud Functions', status: 'operational', uptime: '99.92%' },
    { name: 'Notifications', status: 'degraded', uptime: '98.5%' },
    { name: 'AI Services', status: 'operational', uptime: '99.89%' }
  ]
  return <div className="page-container">
    <div className="page-header">
      <div><h1 className="page-title">System Monitoring</h1><p className="page-subtitle">Monitor platform health and performance</p></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="card"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500"></div><div><p className="font-medium text-gray-900 dark:text-white">All Systems Operational</p><p className="text-sm text-gray-500">No incidents reported</p></div></div></div>
      <div className="card"><p className="text-sm text-gray-500">Response Time</p><p className="text-2xl font-bold text-gray-900 dark:text-white">124ms</p><p className="text-xs text-green-600">↓ 12ms from last week</p></div>
      <div className="card"><p className="text-sm text-gray-500">Active Connections</p><p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p><p className="text-xs text-green-600">↑ 342 from yesterday</p></div>
    </div>
    <div className="card"><h3 className="font-semibold mb-4">Service Status</h3><div className="space-y-2">{services.map((s, i) => <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"><div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${s.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`} /><span className="font-medium text-sm text-gray-700 dark:text-gray-300">{s.name}</span></div><div className="flex items-center gap-4"><span className="text-xs text-gray-400">{s.uptime}</span><span className={`badge-${s.status === 'operational' ? 'success' : 'warning'} text-xs`}>{s.status}</span></div></div>)}</div></div>
  </div>
}
