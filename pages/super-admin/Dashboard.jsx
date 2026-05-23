import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Total Schools', value: '128', change: '+12', icon: '🏫', color: 'bg-blue-500' },
  { label: 'Active Users', value: '45,892', change: '+2,341', icon: '👥', color: 'bg-green-500' },
  { label: 'Monthly Revenue', value: '$128,450', change: '+8.2%', icon: '💰', color: 'bg-purple-500' },
  { label: 'System Health', value: '99.9%', change: 'Optimal', icon: '🟢', color: 'bg-emerald-500' }
]

const recentSchools = [
  { name: 'Springfield High School', users: 1240, status: 'active', plan: 'Premium' },
  { name: 'Riverside Academy', users: 892, status: 'active', plan: 'Standard' },
  { name: 'Hillside Public School', users: 2156, status: 'active', plan: 'Enterprise' },
  { name: 'Valley View School', users: 567, status: 'pending', plan: 'Basic' }
]

const quickActions = [
  { label: 'Add School', path: '/dashboard/super_admin/schools', icon: '➕', color: 'bg-primary-500' },
  { label: 'View Reports', path: '/dashboard/super_admin/analytics', icon: '📊', color: 'bg-secondary-500' },
  { label: 'Moderation', path: '/dashboard/super_admin/moderation', icon: '🛡️', color: 'bg-amber-500' },
  { label: 'System Settings', path: '/dashboard/super_admin/system', icon: '⚙️', color: 'bg-gray-500' }
]

export default function SuperAdminDashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Super Admin Dashboard</h1>
          <p className="page-subtitle">Manage your entire educational ecosystem</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/super_admin/system" className="btn-primary flex items-center gap-2">⚙️ System Settings</Link>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="stat-card">
            <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Schools</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-3 font-medium">School</th>
                  <th className="pb-3 font-medium">Users</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSchools.map((s, i) => (
                  <tr key={i} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 text-gray-900 dark:text-white font-medium">{s.name}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{s.users.toLocaleString()}</td>
                    <td className="py-3"><span className={`badge-${s.plan === 'Premium' ? 'primary' : s.plan === 'Enterprise' ? 'success' : 'warning'}`}>{s.plan}</span></td>
                    <td className="py-3"><span className={`badge-${s.status === 'active' ? 'success' : 'warning'}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/dashboard/super_admin/schools" className="mt-4 inline-block text-sm text-primary-600 font-medium hover:underline">View all schools →</Link>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-lg`}>{action.icon}</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
          <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg">📊 Revenue chart would render here</div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Activity</h3>
          <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg">📈 Activity chart would render here</div>
        </div>
      </div>
    </div>
  )
}
