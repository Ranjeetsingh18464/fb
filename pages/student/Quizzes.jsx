import React, { useState } from "react";

const quizzes = [
  { id: 1, title: "Quadratic Equations Quiz", subject: "Mathematics", questions: 15, timeLimit: "20 min", scheduled: "20 May 2026", status: "Available" },
  { id: 2, title: "Newton's Laws Quiz", subject: "Physics", questions: 10, timeLimit: "15 min", scheduled: "22 May 2026", status: "Available" },
  { id: 3, title: "Periodic Table Challenge", subject: "Chemistry", questions: 20, timeLimit: "25 min", scheduled: "25 May 2026", status: "Available" },
  { id: 4, title: "Human Body Systems", subject: "Biology", questions: 12, timeLimit: "15 min", scheduled: "18 May 2026", status: "Completed" },
  { id: 5, title: "Grammar & Vocabulary", subject: "English", questions: 25, timeLimit: "30 min", scheduled: "15 May 2026", status: "Completed" },
  { id: 6, title: "World History Quiz", subject: "History", questions: 10, timeLimit: "10 min", scheduled: "28 May 2026", status: "Available" },
];

const quizHistory = [
  { quiz: "Human Body Systems", score: "9/12", percentage: 75, grade: "B+", date: "18 May 2026" },
  { quiz: "Grammar & Vocabulary", score: "22/25", percentage: 88, grade: "A", date: "15 May 2026" },
  { quiz: "Algebra Basics", score: "14/15", percentage: 93, grade: "A+", date: "10 May 2026" },
  { quiz: "Chemical Reactions", score: "8/12", percentage: 67, grade: "B", date: "05 May 2026" },
];

const leaderboard = [
  { rank: 1, name: "Priya S.", score: "98%", badge: "🥇" },
  { rank: 2, name: "Arjun K.", score: "95%", badge: "🥈" },
  { rank: 3, name: "Aarav M.", score: "93%", badge: "🥉" },
  { rank: 4, name: "Neha G.", score: "91%" },
  { rank: 5, name: "Rahul P.", score: "88%" },
];

export default function Quizzes() {
  const [startQuiz, setStartQuiz] = useState(null);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Participate in quizzes and track your performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Quizzes</h2>
              <div className="space-y-4">
                {quizzes.filter((q) => q.status === "Available").map((q) => (
                  <div key={q.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{q.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>📖 {q.subject}</span>
                        <span>❓ {q.questions} questions</span>
                        <span>⏱ {q.timeLimit}</span>
                        <span>📅 {q.scheduled}</span>
                      </div>
                    </div>
                    <button onClick={() => setStartQuiz(q.id)} className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap">Start Quiz</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Results History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                      <th className="text-left py-2">Quiz</th>
                      <th className="text-center py-2">Score</th>
                      <th className="text-center py-2">Percentage</th>
                      <th className="text-center py-2">Grade</th>
                      <th className="text-right py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizHistory.map((h) => (
                      <tr key={h.quiz} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{h.quiz}</td>
                        <td className="py-3 text-center text-gray-700 dark:text-gray-300">{h.score}</td>
                        <td className="py-3 text-center">
                          <span className={`font-semibold ${h.percentage >= 90 ? "text-green-600" : h.percentage >= 75 ? "text-blue-600" : h.percentage >= 60 ? "text-yellow-600" : "text-red-600"}`}>{h.percentage}%</span>
                        </td>
                        <td className="py-3 text-center font-bold text-gray-900 dark:text-white">{h.grade}</td>
                        <td className="py-3 text-right text-gray-500 dark:text-gray-400">{h.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏆 Top Scorers</h2>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        entry.rank === 1 ? "bg-yellow-500" : entry.rank === 2 ? "bg-gray-400" : entry.rank === 3 ? "bg-orange-500" : "bg-blue-500"
                      }`}>{entry.rank}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{entry.score}</span>
                      {entry.badge && <span>{entry.badge}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Your Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quizzes Taken</span>
                  <span className="font-bold text-gray-900 dark:text-white">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-bold text-green-600">81%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Best Score</span>
                  <span className="font-bold text-yellow-600">93%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Questions</span>
                  <span className="font-bold text-gray-900 dark:text-white">64</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {startQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl text-center">
              <span className="text-5xl block mb-4">🎯</span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to Start?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Make sure you have enough time and no distractions.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setStartQuiz(null)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                <button onClick={() => setStartQuiz(null)} className="btn-primary bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium">Start Now!</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
