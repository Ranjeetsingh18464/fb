import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function SchoolAdminDashboard() {
  const stats = [
    { label: 'Total Students', value: '1,245', change: '+23', icon: '🎓', color: 'bg-blue-500' },
    { label: 'Teachers', value: '68', change: '+2', icon: '👨‍🏫', color: 'bg-green-500' },
    { label: 'Classes', value: '32', change: '0', icon: '📚', color: 'bg-purple-500' },
    { label: 'Attendance Today', value: '94.2%', change: '+1.5%', icon: '📋', color: 'bg-amber-500' }
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">School Dashboard</h1>
          <p className="page-subtitle">Springfield High School - Manage your school operations</p>
        </div>
        <Link to="/dashboard/school_admin/customization" className="btn-outline flex items-center gap-2">🎨 Customize</Link>
      </div>

      <div className="dashboard-grid mb-8">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className={`w-14 h-14 ${s.color} rounded-xl flex items-center justify-center text-2xl`}>{s.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className={`text-xs font-medium ${s.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>{s.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Add Teacher', path: '/dashboard/school_admin/teachers', icon: '👨‍🏫' },
              { label: 'Add Student', path: '/dashboard/school_admin/students', icon: '🎓' },
              { label: 'Create Class', path: '/dashboard/school_admin/classes', icon: '📚' },
              { label: 'Manage Fees', path: '/dashboard/school_admin/fees', icon: '💰' },
              { label: 'Attendance', path: '/dashboard/school_admin/attendance', icon: '📋' },
              { label: 'Homework', path: '/dashboard/school_admin/homework', icon: '📝' },
              { label: 'Events', path: '/dashboard/school_admin/events', icon: '🎉' },
              { label: 'Notices', path: '/dashboard/school_admin/announcements', icon: '📢' }
            ].map((a, i) => (
              <Link key={i} to={a.path} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4">Subscription</h3>
          <div className="text-center p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl text-white mb-4">
            <p className="text-2xl font-bold">Premium</p>
            <p className="text-sm text-primary-100">$399/mo</p>
            <div className="mt-3 text-xs text-primary-100">✓ Up to 5,000 users</div>
            <div className="text-xs text-primary-100">✓ Advanced analytics</div>
            <div className="text-xs text-primary-100">✓ Priority support</div>
          </div>
          <Link to="/dashboard/school_admin/customization" className="btn-ghost w-full text-center text-sm">Manage Plan</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card"><h3 className="font-semibold mb-4">Attendance Trends</h3><div className="h-48 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center text-gray-400">📈 Attendance chart</div></div>
        <div className="card"><h3 className="font-semibold mb-4">Recent Activity</h3><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-primary-500"></div><p className="text-gray-600 dark:text-gray-400">Activity event {i + 1} happened</p><span className="text-xs text-gray-400 ml-auto">{i + 1}h ago</span></div>)}</div></div>
      </div>
    </div>
  )
}
