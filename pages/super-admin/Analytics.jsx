import { motion } from 'framer-motion'

const metrics = [
  { label: 'DAU/MAU', value: '68%', trend: '+5%' },
  { label: 'Avg. Session', value: '24m', trend: '+3m' },
  { label: 'Schools Active', value: '124/128', trend: '96.8%' },
  { label: 'Users Today', value: '38,450', trend: '+1,234' }
]

export default function Analytics() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Analytics</h1>
          <p className="page-subtitle">Track platform-wide metrics and trends</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{m.value}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
            <p className="text-xs text-green-600 mt-1">{m.trend}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card"><h3 className="font-semibold mb-4">User Growth</h3><div className="h-64 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center text-gray-400">📊 User Growth Chart</div></div>
        <div className="card"><h3 className="font-semibold mb-4">Revenue Trends</h3><div className="h-64 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center text-gray-400">📈 Revenue Chart</div></div>
        <div className="card"><h3 className="font-semibold mb-4">School Distribution</h3><div className="h-64 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center text-gray-400">🗺️ Map / Geo Chart</div></div>
        <div className="card"><h3 className="font-semibold mb-4">Feature Usage</h3><div className="h-64 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center text-gray-400">📊 Feature Usage Chart</div></div>
      </div>
    </div>
  )
}
