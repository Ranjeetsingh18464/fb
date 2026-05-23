import React from "react";

const subjectPerformance = [
  { subject: "Mathematics", score: 85, color: "bg-blue-500" },
  { subject: "Physics", score: 78, color: "bg-purple-500" },
  { subject: "Chemistry", score: 82, color: "bg-green-500" },
  { subject: "Biology", score: 90, color: "bg-teal-500" },
  { subject: "English", score: 88, color: "bg-yellow-500" },
  { subject: "History", score: 72, color: "bg-orange-500" },
  { subject: "Geography", score: 76, color: "bg-indigo-500" },
  { subject: "Computer", score: 95, color: "bg-pink-500" },
];

const attendanceTrend = [
  { month: "Jan", pct: 88 },
  { month: "Feb", pct: 92 },
  { month: "Mar", pct: 85 },
  { month: "Apr", pct: 94 },
  { month: "May", pct: 90 },
  { month: "Jun", pct: 94 },
];

const homeworkCompletion = [
  { week: "Week 1", completed: 5, total: 6 },
  { week: "Week 2", completed: 4, total: 5 },
  { week: "Week 3", completed: 6, total: 6 },
  { week: "Week 4", completed: 3, total: 5 },
  { week: "Week 5", completed: 5, total: 5 },
  { week: "Week 6", completed: 4, total: 4 },
];

const quizPerformance = [
  { quiz: "Algebra", score: 93 },
  { quiz: "Physics", score: 85 },
  { quiz: "Chemistry", score: 78 },
  { quiz: "Biology", score: 90 },
  { quiz: "English", score: 88 },
  { quiz: "History", score: 72 },
];

const gradeHistory = [
  { exam: "Unit Test 1", grade: "B+" },
  { exam: "Unit Test 2", grade: "A" },
  { exam: "Mid-Term", grade: "A-" },
  { exam: "Unit Test 3", grade: "A" },
  { exam: "Pre-Final", grade: "A+" },
];

export default function Progress() {
  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Progress Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your academic performance across all metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall Average</p>
            <p className="text-2xl font-bold text-blue-600">83%</p>
            <span className="text-xs text-green-600">↑ 2% from last term</span>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p>
            <p className="text-2xl font-bold text-green-600">94%</p>
            <span className="text-xs text-green-600">↑ 1% from last month</span>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Homework Rate</p>
            <p className="text-2xl font-bold text-purple-600">87%</p>
            <span className="text-xs text-gray-500">31/36 completed</span>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Quiz Average</p>
            <p className="text-2xl font-bold text-yellow-600">84%</p>
            <span className="text-xs text-green-600">↑ 5% improvement</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Performance</h2>
            <div className="space-y-4">
              {subjectPerformance.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{s.subject}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{s.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className={`${s.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${s.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend</h2>
            <div className="flex items-end gap-3 h-48">
              {attendanceTrend.map((t) => (
                <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.pct}%</span>
                  <div className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-t-lg transition-all duration-500" style={{ height: `${t.pct}%` }}>
                    <div className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-lg" style={{ height: "100%" }}></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Homework Completion Rate</h2>
            <div className="space-y-3">
              {homeworkCompletion.map((w) => (
                <div key={w.week}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{w.week}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{w.completed}/{w.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(w.completed / w.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Performance</h2>
            <div className="space-y-3">
              {quizPerformance.map((q) => (
                <div key={q.quiz}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{q.quiz}</span>
                    <span className={`font-bold ${q.score >= 90 ? "text-green-600" : q.score >= 75 ? "text-blue-600" : "text-yellow-600"}`}>{q.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${q.score >= 90 ? "bg-green-500" : q.score >= 75 ? "bg-blue-500" : "bg-yellow-500"}`} style={{ width: `${q.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Improvement</h2>
            <div className="space-y-4">
              {gradeHistory.map((g, i) => (
                <div key={g.exam} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      g.grade.startsWith("A+") ? "bg-green-500" : g.grade.startsWith("A") ? "bg-blue-500" : g.grade.startsWith("B") ? "bg-yellow-500" : "bg-red-500"
                    }`}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{g.exam}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${
                    g.grade.startsWith("A+") ? "text-green-600" : g.grade.startsWith("A") ? "text-blue-600" : g.grade.startsWith("B") ? "text-yellow-600" : "text-red-600"
                  }`}>{g.grade}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">📈 Your grades are improving!</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Consistent upward trend from B+ to A+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
