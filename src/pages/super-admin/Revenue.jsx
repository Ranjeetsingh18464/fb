import { useState } from 'react'

const stats = [
  { label: 'Monthly Revenue', value: '₹12.8L', change: '+8%' },
  { label: 'Annual Revenue', value: '₹45.2L', change: '+18%' },
  { label: 'Pending Payouts', value: '₹1.2L', change: '-3%' },
  { label: 'Avg per School', value: '₹15.1L', change: '+5%' },
]

const transactions = [
  { id: 1, date: '2026-05-15', school: 'Delhi Public School', amount: '₹2,50,000', status: 'Completed' },
  { id: 2, date: '2026-05-14', school: 'Springfields Academy', amount: '₹1,80,000', status: 'Completed' },
  { id: 3, date: '2026-05-12', school: 'St. Mary\'s Convent', amount: '₹95,000', status: 'Pending' },
  { id: 4, date: '2026-05-10', school: 'Delhi Public School', amount: '₹2,50,000', status: 'Completed' },
  { id: 5, date: '2026-05-08', school: 'Springfields Academy', amount: '₹1,80,000', status: 'Failed' },
  { id: 6, date: '2026-05-05', school: 'St. Mary\'s Convent', amount: '₹95,000', status: 'Completed' },
  { id: 7, date: '2026-05-01', school: 'Delhi Public School', amount: '₹2,50,000', status: 'Completed' },
]

const statusColors = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function Revenue() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.status.toLowerCase() === filter)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Revenue</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{s.change} vs last period</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transactions</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">School</th>
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left px-2 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-2 py-3 text-gray-900 dark:text-white">{t.date}</td>
                    <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{t.school}</td>
                    <td className="px-2 py-3 text-gray-900 dark:text-white font-medium">{t.amount}</td>
                    <td className="px-2 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
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
