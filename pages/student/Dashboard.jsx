import React from "react";

const stats = [
  { label: "Pending Homework", value: "3", icon: "📚" },
  { label: "Attendance", value: "94%", icon: "📋" },
  { label: "Upcoming Exams", value: "2", icon: "📝" },
  { label: "My Average", value: "85%", icon: "📊" },
];

const timetable = [
  { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
  { time: "08:45 - 09:30", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
  { time: "09:30 - 10:15", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
  { time: "10:30 - 11:15", subject: "English", teacher: "Ms. Singh", room: "104" },
];

const homework = [
  { subject: "Mathematics", title: "Quadratic Equations", due: "Tomorrow", priority: "High" },
  { subject: "Physics", title: "Laws of Motion", due: "In 3 days", priority: "Medium" },
  { subject: "Chemistry", title: "Periodic Table", due: "In 5 days", priority: "Low" },
];

const achievements = [
  { name: "Math Whiz", emoji: "🏆", earned: true },
  { name: "Perfect Attendance", emoji: "⭐", earned: false },
  { name: "Homework Hero", emoji: "🎯", earned: true },
  { name: "Quiz Master", emoji: "👑", earned: false },
];

const quickActions = [
  { label: "New Note", icon: "📝", color: "bg-blue-500" },
  { label: "Ask AI", icon: "🤖", color: "bg-purple-500" },
  { label: "Join Quiz", icon: "🎯", color: "bg-green-500" },
  { label: "Study Plan", icon: "📅", color: "bg-orange-500" },
  { label: "Homework", icon: "📚", color: "bg-pink-500" },
  { label: "Results", icon: "📊", color: "bg-teal-500" },
];

export default function Dashboard() {
  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, Aarav! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's your learning overview for today
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <div className="badge badge-primary bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
              Class 10 - Section A
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Today's Timetable
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">Subject</th>
                      <th className="text-left py-2">Teacher</th>
                      <th className="text-left py-2">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((period) => (
                      <tr key={period.time} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 text-gray-700 dark:text-gray-300">{period.time}</td>
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{period.subject}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{period.teacher}</td>
                        <td className="py-3">
                          <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                            Room {period.room}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Homework
              </h2>
              <div className="space-y-3">
                {homework.map((hw) => (
                  <div key={hw.title} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{hw.subject}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{hw.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{hw.due}</span>
                      <span className={`badge text-xs px-2 py-0.5 rounded-full ${
                        hw.priority === "High" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" :
                        hw.priority === "Medium" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" :
                        "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      }`}>{hw.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Study Tip of the Day
              </h2>
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  "Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break.
                  This improves focus and prevents burnout. Try it with your next study session!"
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎮 Your Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">XP Points</span>
                    <span className="font-semibold text-gray-900 dark:text-white">2,450 / 5,000</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full" style={{ width: "49%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">🔥 Streak</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Keep it going!</p>
                  </div>
                  <span className="text-2xl font-bold text-orange-500">12 days</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">🏅 Level</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Silver Scholar</p>
                  </div>
                  <span className="text-2xl">🌟</span>
                </div>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🏆 Achievements
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div key={ach.name} className={`p-3 rounded-lg text-center ${
                    ach.earned
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                      : "bg-gray-100 dark:bg-gray-700 opacity-50"
                  }`}>
                    <span className="text-2xl block">{ach.emoji}</span>
                    <p className="text-xs mt-1 font-medium text-gray-700 dark:text-gray-300">{ach.name}</p>
                    {!ach.earned && <p className="text-[10px] text-gray-400 dark:text-gray-500">Locked</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚡ Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button key={action.label} className={`${action.color} text-white rounded-lg p-3 text-center hover:opacity-90 transition-opacity`}>
                    <span className="text-xl block mb-1">{action.icon}</span>
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
