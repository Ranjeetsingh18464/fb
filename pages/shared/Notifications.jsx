import React, { useState } from 'react';

const mockNotifications = [
  { id: 1, icon: '📚', category: 'Homework', title: 'New Assignment', message: 'Math homework for Chapter 5 has been posted.', time: '10m ago', read: false },
  { id: 2, icon: '✅', category: 'Attendance', title: 'Attendance Marked', message: 'Your attendance for today has been marked present.', time: '1h ago', read: false },
  { id: 3, icon: '💰', category: 'Fees', title: 'Fee Reminder', message: 'Tuition fee for March is due. Pay by 20th March.', time: '3h ago', read: true },
  { id: 4, icon: '📝', category: 'Exams', title: 'Exam Schedule', message: 'Mid-term exam schedule has been published.', time: '5h ago', read: true },
  { id: 5, icon: '👥', category: 'Groups', title: 'Group Invite', message: 'You have been added to Science Club.', time: '1d ago', read: true },
  { id: 6, icon: '💬', category: 'Messages', title: 'New Message', message: 'Dr. Sharma sent you a message.', time: '2d ago', read: true },
  { id: 7, icon: '🏆', category: 'Achievements', title: 'Achievement Liked', message: 'Rahul liked your achievement post.', time: '3d ago', read: true },
];

const filters = ['All', 'Homework', 'Attendance', 'Fees', 'Exams', 'Groups', 'Messages', 'Achievements'];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = activeFilter === 'All'
    ? notifications
    : notifications.filter(n => n.category === activeFilter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
    setShowConfirm(false);
  };

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="page-header text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {showConfirm && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-yellow-800 dark:text-yellow-200">Clear all notifications?</span>
            <div className="flex gap-2">
              <button onClick={clearAll} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg">Yes</button>
              <button onClick={() => setShowConfirm(false)} className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg">No</button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => (
              <div
                key={n.id}
                onClick={() => markOneRead(n.id)}
                className={`card card-hover bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                  n.read
                    ? 'border-gray-200 dark:border-gray-700'
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm ${n.read ? 'font-medium' : 'font-semibold'} text-gray-900 dark:text-white`}>
                          {n.title}
                        </h3>
                        {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{n.message}</p>
                    <span className="text-xs text-blue-500 mt-1 inline-block">{n.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
