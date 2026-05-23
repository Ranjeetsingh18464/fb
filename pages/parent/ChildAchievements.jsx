import React, { useState } from "react";

const children = [
  { id: 1, name: "Aarav Sharma", class: "10 - A" },
  { id: 2, name: "Ananya Sharma", class: "8 - B" },
];

const badges = [
  { id: 1, name: "Math Whiz", emoji: "🏆", description: "Score 95%+ in Math exam", earned: true, earnedDate: "15 Apr 2026" },
  { id: 2, name: "Perfect Attendance", emoji: "⭐", description: "Attend all classes for a month", earned: false },
  { id: 3, name: "Homework Hero", emoji: "🎯", description: "Submit 30 homework on time", earned: true, earnedDate: "10 May 2026" },
  { id: 4, name: "Quiz Master", emoji: "👑", description: "Win 5 quiz competitions", earned: false },
  { id: 5, name: "Streak Champion", emoji: "🔥", description: "Maintain 30-day streak", earned: true, earnedDate: "08 May 2026" },
  { id: 6, name: "Science Star", emoji: "🔬", description: "Score 90%+ in all sciences", earned: false },
  { id: 7, name: "Bookworm", emoji: "📖", description: "Read 10 recommended books", earned: true, earnedDate: "12 May 2026" },
  { id: 8, name: "Coding Ninja", emoji: "💻", description: "Complete all coding assignments", earned: false },
  { id: 9, name: "Top Performer", emoji: "🚀", description: "Rank in top 3 of class", earned: true, earnedDate: "05 May 2026" },
];

const certificates = [
  { id: 1, name: "Mathematics Olympiad", issuedBy: "School Board", date: "Mar 2026", type: "Certificate" },
  { id: 2, name: "Science Fair Winner", issuedBy: "Science Department", date: "Feb 2026", type: "Award" },
  { id: 3, name: "Best Student Award", issuedBy: "Principal", date: "Jan 2026", type: "Award" },
];

export default function ChildAchievements() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);

  const earned = badges.filter((b) => b.earned).length;
  const total = badges.length;
  const progress = Math.round((earned / total) * 100);

  const child = children.find((c) => c.id === selectedChild);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track badges, awards, and progress</p>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 shadow-sm text-white">
            <p className="text-sm opacity-90">Total XP</p>
            <p className="text-3xl font-bold mt-1">4,590</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs opacity-90 mb-1">
                <span>Progress to next level</span>
                <span>4,590 / 5,000</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold">Level: Gold Scholar</p>
          </div>

          <div className="card bg-gradient-to-br from-red-400 to-pink-500 rounded-xl p-6 shadow-sm text-white">
            <p className="text-sm opacity-90">Study Streak</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl">🔥</span>
              <span className="text-3xl font-bold">15 Days</span>
            </div>
            <p className="text-sm opacity-90 mt-2">Best streak: 21 days</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl p-6 shadow-sm text-white">
            <p className="text-sm opacity-90">Badges Earned</p>
            <p className="text-3xl font-bold mt-1">{earned}/{total}</p>
            <div className="mt-3">
              <div className="w-full bg-white/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold">{progress}% Complete</p>
          </div>

          <div className="card bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl p-6 shadow-sm text-white">
            <p className="text-sm opacity-90">Current Level</p>
            <p className="text-3xl font-bold mt-1">Gold</p>
            <p className="text-sm opacity-90 mt-2">Next: Platinum at 5,000 XP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badges</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className={`p-4 rounded-xl text-center transition-all ${
                    badge.earned
                      ? "bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30 border border-yellow-300 dark:border-yellow-700 shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 opacity-60"
                  }`}>
                    <span className="text-3xl block">{badge.emoji}</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">{badge.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                    {badge.earned ? (
                      <span className="text-[10px] text-green-600 dark:text-green-400 mt-1 block">✅ {badge.earnedDate}</span>
                    ) : (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">🔒 Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certificates & Awards</h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{cert.type === "Award" ? "🏅" : "📜"}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{cert.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Issued by: {cert.issuedBy}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{cert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Streak Milestones</h2>
              <div className="space-y-3">
                {[7, 14, 21, 30, 60].map((days) => {
                  const achieved = days <= 15;
                  return (
                    <div key={days} className={`flex items-center justify-between p-3 rounded-lg ${
                      achieved
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg ${achieved ? "" : "opacity-40"}`}>{achieved ? "🔥" : "⏳"}</span>
                        <div>
                          <p className={`text-sm font-medium ${achieved ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                            {days}-Day Streak {achieved ? "Achieved" : "Locked"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Study {days} consecutive days</p>
                        </div>
                      </div>
                      {achieved ? <span className="text-green-600 dark:text-green-400 text-sm">✅</span> : <span className="text-gray-400 text-sm">🔒</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
