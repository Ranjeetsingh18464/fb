import { useState } from 'react'

const cards = [
  { label: 'Total Users', value: '1,247', change: '+12%', positive: true },
  { label: 'Total Schools', value: '3', change: '0%', positive: true },
  { label: 'Revenue (YTD)', value: '₹45.2L', change: '+18%', positive: true },
  { label: 'Growth Rate', value: '23.5%', change: '+3.2pp', positive: true },
]

const recentActivity = [
  { event: 'School registration', detail: 'New school onboarding in progress', user: 'System', time: '2 min ago' },
  { event: 'Revenue milestone', detail: 'Crossed ₹45L in total revenue', user: 'System', time: '1 hr ago' },
  { event: 'User spike', detail: '120 new users joined in last 24h', user: 'Analytics', time: '3 hr ago' },
  { event: 'Ad revenue report', detail: 'Q3 ad revenue up 22% QoQ', user: 'System', time: '6 hr ago' },
  { event: 'Content flag', detail: '15 items flagged for moderation', user: 'Moderation Bot', time: '8 hr ago' },
]

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h1>

        <div className="flex gap-2 mb-6">
          {['overview', 'users', 'revenue', 'growth'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{c.value}</p>
              <p className={`text-sm mt-1 ${c.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {c.change} vs last month
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">Event</th>
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">Detail</th>
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">Source</th>
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-2 py-3 text-gray-900 dark:text-white font-medium">{item.event}</td>
                    <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{item.detail}</td>
                    <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{item.user}</td>
                    <td className="px-2 py-3 text-gray-400 dark:text-gray-500">{item.time}</td>
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
