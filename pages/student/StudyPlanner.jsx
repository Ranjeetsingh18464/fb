import React, { useState } from "react";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer"];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initialSchedule = [
  { day: "Monday", subject: "Mathematics", time: "16:00 - 17:00", topic: "Quadratic Equations" },
  { day: "Monday", subject: "Physics", time: "17:00 - 18:00", topic: "Laws of Motion" },
  { day: "Tuesday", subject: "Chemistry", time: "16:00 - 17:00", topic: "Periodic Table" },
  { day: "Tuesday", subject: "English", time: "17:00 - 18:00", topic: "Essay Writing" },
  { day: "Wednesday", subject: "Biology", time: "16:00 - 17:00", topic: "Human Digestive System" },
  { day: "Wednesday", subject: "Mathematics", time: "17:00 - 18:00", topic: "Practice Problems" },
  { day: "Thursday", subject: "History", time: "16:00 - 17:00", topic: "World War II" },
  { day: "Thursday", subject: "Physics", time: "17:00 - 18:00", topic: "Numerical Problems" },
  { day: "Friday", subject: "Chemistry", time: "16:00 - 17:00", topic: "Chemical Reactions" },
  { day: "Friday", subject: "Computer", time: "17:00 - 18:00", topic: "Python Programming" },
  { day: "Saturday", subject: "Revision", time: "10:00 - 12:00", topic: "Weekly Revision" },
];

const performanceData = [
  { subject: "Mathematics", score: 85 },
  { subject: "Physics", score: 78 },
  { subject: "Chemistry", score: 82 },
  { subject: "Biology", score: 90 },
  { subject: "English", score: 88 },
  { subject: "History", score: 72 },
  { subject: "Geography", score: 76 },
  { subject: "Computer", score: 95 },
];

const recommendations = [
  { subject: "Mathematics", reason: "Your practice test score dropped 5%", action: "Increase practice time" },
  { subject: "Physics", reason: "Weak area: Numerical problems", action: "Focus on formula practice" },
  { subject: "Biology", reason: "Strong performance, maintain current pace", action: "Continue regular revision" },
];

export default function StudyPlanner() {
  const [showForm, setShowForm] = useState(false);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [formData, setFormData] = useState({ subject: "Mathematics", topic: "", day: "Monday", time: "", duration: "1 hour" });
  const [completedSessions, setCompletedSessions] = useState([0, 2]);

  const handleAddPlan = (e) => {
    e.preventDefault();
    setSchedule([...schedule, { day: formData.day, subject: formData.subject, time: formData.time, topic: formData.topic }]);
    setShowForm(false);
    setFormData({ subject: "Mathematics", topic: "", day: "Monday", time: "", duration: "1 hour" });
  };

  const toggleComplete = (idx) => {
    setCompletedSessions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const totalSessions = schedule.length;
  const completedCount = completedSessions.length;
  const progressPct = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Planner</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Plan and track your study sessions</p>
          </div>
          <button onClick={() => setShowForm(true)} className="mt-4 sm:mt-0 btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Create Study Plan</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSessions}</p>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{totalSessions - completedCount}</p>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-2xl font-bold text-blue-600">{progressPct}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Study Schedule</h2>
              <div className="space-y-4">
                {weekDays.map((day) => {
                  const daySessions = schedule.filter((s) => s.day === day);
                  if (daySessions.length === 0) return null;
                  return (
                    <div key={day}>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{day}</h3>
                      <div className="space-y-2">
                        {daySessions.map((session, idx) => {
                          const globalIdx = schedule.indexOf(session);
                          return (
                            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                              completedSessions.includes(globalIdx)
                                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                                : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                            }`} onClick={() => toggleComplete(globalIdx)}>
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  completedSessions.includes(globalIdx) ? "bg-green-500 border-green-500" : "border-gray-400"
                                }`}>
                                  {completedSessions.includes(globalIdx) && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{session.subject}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{session.time} - {session.topic}</p>
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300`}>{session.subject}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Study Progress</h2>
              <div className="text-center mb-4">
                <div className="relative w-28 h-28 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${progressPct * 2.513} 251.3`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{progressPct}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Completed</span><span className="font-medium text-gray-900 dark:text-white">{completedCount}/{totalSessions}</span></div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h2>
              <div className="space-y-3">
                {performanceData.map((p) => (
                  <div key={p.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{p.subject}</span>
                      <span className={`font-medium ${p.score >= 80 ? "text-green-600" : p.score >= 60 ? "text-yellow-600" : "text-red-600"}`}>{p.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${p.score >= 80 ? "bg-green-500" : p.score >= 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${p.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Smart Recommendations</h2>
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300`}>{rec.subject}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rec.reason}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">→ {rec.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create Study Plan</h2>
              <form onSubmit={handleAddPlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                  <input type="text" value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="e.g., Quadratic Equations" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
                  <select value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    {weekDays.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input type="text" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="e.g., 16:00 - 17:00" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                  <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    <option>30 min</option>
                    <option>1 hour</option>
                    <option>1.5 hours</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                  <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Add to Schedule</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
