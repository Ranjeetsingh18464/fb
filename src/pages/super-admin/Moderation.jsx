import { useState } from 'react'

const initialItems = [
  { id: 1, type: 'Review', author: 'user_4421', content: 'Inappropriate language in comment', reportedBy: 'Teacher', date: '2026-05-17', status: 'pending' },
  { id: 2, type: 'Post', author: 'user_8812', content: 'Spam link shared in forum', reportedBy: 'System', date: '2026-05-17', status: 'pending' },
  { id: 3, type: 'Image', author: 'user_3304', content: 'Potentially offensive image in gallery', reportedBy: 'Parent', date: '2026-05-16', status: 'pending' },
  { id: 4, type: 'Comment', author: 'user_5591', content: 'Harassing comment on homework post', reportedBy: 'Student', date: '2026-05-16', status: 'pending' },
  { id: 5, type: 'Profile', author: 'user_7723', content: 'Fake profile using celebrity photo', reportedBy: 'Admin', date: '2026-05-15', status: 'approved' },
  { id: 6, type: 'Review', author: 'user_2147', content: 'Plagiarized assignment submission', reportedBy: 'Teacher', date: '2026-05-14', status: 'rejected' },
]

export default function Moderation() {
  const [items, setItems] = useState(initialItems)
  const [filter, setFilter] = useState('pending')

  const handleAction = (id, status) => {
    setItems(items.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Moderation</h1>

        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f} {f === 'all' ? '' : `(${items.filter((i) => i.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {item.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : item.status === 'approved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{item.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    By {item.author} &middot; Reported by {item.reportedBy} &middot; {item.date}
                  </p>
                </div>
                {item.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(item.id, 'approved')}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'rejected')}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No {filter} items found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
