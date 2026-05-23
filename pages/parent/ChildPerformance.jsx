import React, { useState } from "react";

const children = [
  { id: 1, name: "Aarav Sharma", class: "10 - A" },
  { id: 2, name: "Ananya Sharma", class: "8 - B" },
];

const subjectPerformance = [
  { subject: "Mathematics", score: 88, max: 100, grade: "A", trend: "up", color: "bg-blue-500" },
  { subject: "Physics", score: 82, max: 100, grade: "A", trend: "stable", color: "bg-purple-500" },
  { subject: "Chemistry", score: 76, max: 100, grade: "B+", trend: "down", color: "bg-green-500" },
  { subject: "Biology", score: 90, max: 100, grade: "A+", trend: "up", color: "bg-teal-500" },
  { subject: "English", score: 85, max: 100, grade: "A", trend: "stable", color: "bg-yellow-500" },
  { subject: "History", score: 70, max: 100, grade: "B", trend: "down", color: "bg-orange-500" },
  { subject: "Geography", score: 78, max: 100, grade: "B+", trend: "up", color: "bg-indigo-500" },
  { subject: "Computer", score: 95, max: 100, grade: "A+", trend: "up", color: "bg-pink-500" },
];

const attendanceTrend = [
  { month: "Jan", pct: 92 },
  { month: "Feb", pct: 88 },
  { month: "Mar", pct: 96 },
  { month: "Apr", pct: 90 },
  { month: "May", pct: 94 },
  { month: "Jun", pct: 91 },
];

const quizPerformance = [
  { quiz: "Math Quiz 1", score: 18, max: 20, date: "10 May" },
  { quiz: "Science Quiz", score: 15, max: 20, date: "05 May" },
  { quiz: "English Grammar", score: 19, max: 20, date: "28 Apr" },
  { quiz: "History Quiz", score: 14, max: 20, date: "20 Apr" },
  { quiz: "Computer Quiz", score: 20, max: 20, date: "15 Apr" },
];

const teacherFeedback = [
  { teacher: "Dr. Sharma", subject: "Mathematics", comment: "Aarav is very focused and shows great problem-solving skills. Keep practicing word problems.", date: "15 May 2026", type: "positive" },
  { teacher: "Mrs. Gupta", subject: "Physics", comment: "Good understanding of concepts. Needs to work on numerical calculations.", date: "12 May 2026", type: "constructive" },
  { teacher: "Mr. Verma", subject: "Chemistry", comment: "Active participation in lab work. Should focus on theory as well.", date: "10 May 2026", type: "constructive" },
  { teacher: "Ms. Singh", subject: "English", comment: "Excellent writing skills. One of the best essays in the class.", date: "08 May 2026", type: "positive" },
];

export default function ChildPerformance() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);

  const overallPct = Math.round(subjectPerformance.reduce((sum, s) => sum + s.score, 0) / subjectPerformance.reduce((sum, s) => sum + s.max, 0) * 100);
  const homeworkCompletion = 85;

  const child = children.find((c) => c.id === selectedChild);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Tracking</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Comprehensive view of your child's academic performance</p>
          </div>
          <div className="mt-4 sm:mt-0">
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
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall Performance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{overallPct}%</p>
            <span className="text-xs text-green-600">+2% from last term</span>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">94%</p>
            <span className="text-xs text-green-600">Regular</span>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Homework Completion</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{homeworkCompletion}%</p>
            <span className="text-xs text-yellow-600">3 pending</span>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Quiz Average</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">86%</p>
            <span className="text-xs text-green-600">Above class average</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Performance</h2>
            <div className="space-y-4">
              {subjectPerformance.map((sub) => {
                const pct = Math.round((sub.score / sub.max) * 100);
                return (
                  <div key={sub.subject}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${sub.color}`}></span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{sub.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{pct}%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({sub.grade})</span>
                        <span className={`text-xs ${sub.trend === "up" ? "text-green-500" : sub.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                          {sub.trend === "up" ? "▲" : sub.trend === "down" ? "▼" : "―"}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className={`${sub.color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trends</h2>
            <div className="flex items-end gap-3 h-48">
              {attendanceTrend.map((t) => (
                <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.pct}%</span>
                  <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-t-lg" style={{ height: `${t.pct}%` }}>
                    <div className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-lg transition-all duration-500" style={{ height: "100%" }}></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Performance</h2>
            <div className="space-y-3">
              {quizPerformance.map((q) => {
                const pct = Math.round((q.score / q.max) * 100);
                return (
                  <div key={q.quiz} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{q.quiz}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{q.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{q.score}/{q.max}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        pct >= 90 ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" :
                        pct >= 75 ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" :
                        pct >= 60 ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" :
                        "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      }`}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Homework Completion Rate</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray={`${homeworkCompletion * 2.513} 251.3`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{homeworkCompletion}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">15 of 18 assignments submitted on time</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teacher Feedback</h2>
            <div className="space-y-3">
              {teacherFeedback.map((fb, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${
                  fb.type === "positive"
                    ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                    : "bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800"
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{fb.teacher}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({fb.subject})</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      fb.type === "positive"
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                    }`}>{fb.type === "positive" ? "Positive" : "Suggestion"}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{fb.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{fb.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Improvement Suggestions</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📚</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Focus on Chemistry & History</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">These subjects need more attention. Consider allocating extra study time and practicing past papers.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⏰</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Improve Time Management</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Creating a study schedule can help balance all subjects effectively. Use the Pomodoro technique.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🎯</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Keep Up the Good Work!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mathematics and Computer show excellent progress. Continue the current study approach for these subjects.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
