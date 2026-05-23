import React, { useState } from "react";

const children = [
  { id: 1, name: "Aarav Sharma", class: "10 - A" },
  { id: 2, name: "Ananya Sharma", class: "8 - B" },
];

const stats = [
  { label: "Attendance", value: "94%", icon: "📋" },
  { label: "Recent Results", value: "A-", icon: "📊" },
  { label: "Pending Fees", value: "$150", icon: "💰" },
  { label: "Upcoming Events", value: "2", icon: "📅" },
];

const overviewCards = [
  { title: "Today's Homework", value: "3 subjects", detail: "Math, Physics, English", color: "bg-blue-500" },
  { title: "Next Exam", value: "21 May", detail: "Mathematics - Mid Term", color: "bg-purple-500" },
  { title: "Recent Result", value: "A-", detail: "Physics - Weekly Test", color: "bg-green-500" },
  { title: "Teacher Messages", value: "2 unread", detail: "Dr. Sharma, Mrs. Gupta", color: "bg-orange-500" },
];

const notifications = [
  { id: 1, message: "Homework assigned in Mathematics", time: "1 hour ago", type: "info" },
  { id: 2, message: "Fee due reminder: $150 pending", time: "3 hours ago", type: "warning" },
  { id: 3, message: "Parent-Teacher meeting on 25 May", time: "1 day ago", type: "info" },
  { id: 4, message: "Aarav scored A+ in Biology test", time: "2 days ago", type: "success" },
  { id: 5, message: "School holiday on 30 May", time: "3 days ago", type: "info" },
];

const quickActions = [
  { label: "View Attendance", icon: "📋", color: "bg-blue-500" },
  { label: "Pay Fees", icon: "💰", color: "bg-green-500" },
  { label: "Message Teacher", icon: "💬", color: "bg-purple-500" },
  { label: "View Timetable", icon: "📅", color: "bg-orange-500" },
];

export default function Dashboard() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your child's progress at a glance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {children.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.class}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card) => (
            <div key={card.title} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white text-lg mb-3`}>
                {card.title.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Notifications</h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      n.type === "warning" ? "bg-yellow-500" : n.type === "success" ? "bg-green-500" : "bg-blue-500"
                    }`}></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button key={action.label} className={`${action.color} text-white rounded-lg p-4 text-center hover:opacity-90 transition-opacity`}>
                  <span className="text-2xl block mb-1">{action.icon}</span>
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
