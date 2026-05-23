import React, { useState } from "react";

const allAchievements = [
  { id: 1, name: "Math Whiz", emoji: "🏆", description: "Score 95%+ in Math exam", earned: true, earnedDate: "15 Apr 2026" },
  { id: 2, name: "Perfect Attendance", emoji: "⭐", description: "Attend all classes for a month", earned: false },
  { id: 3, name: "Homework Hero", emoji: "🎯", description: "Submit 30 homework on time", earned: true, earnedDate: "10 May 2026" },
  { id: 4, name: "Quiz Master", emoji: "👑", description: "Win 5 quiz competitions", earned: false },
  { id: 5, name: "Streak Champion", emoji: "🔥", description: "Maintain 30-day streak", earned: true, earnedDate: "08 May 2026" },
  { id: 6, name: "Science Star", emoji: "🔬", description: "Score 90%+ in all sciences", earned: false },
  { id: 7, name: "Bookworm", emoji: "📖", description: "Read 10 recommended books", earned: false },
  { id: 8, name: "Coding Ninja", emoji: "💻", description: "Complete all coding assignments", earned: true, earnedDate: "12 May 2026" },
  { id: 9, name: "Top Performer", emoji: "🚀", description: "Rank in top 3 of class", earned: false },
  { id: 10, name: "Consistency King", emoji: "👑", description: "Study every day for 60 days", earned: false },
  { id: 11, name: "Grammar Guru", emoji: "📝", description: "Get 100% in grammar test", earned: true, earnedDate: "05 May 2026" },
  { id: 12, name: "Early Bird", emoji: "🌅", description: "Complete 20 morning study sessions", earned: false },
];

const leaderboard = [
  { rank: 1, name: "Priya S.", xp: 4850, level: "Gold" },
  { rank: 2, name: "Arjun K.", xp: 4720, level: "Gold" },
  { rank: 3, name: "Aarav M.", xp: 4590, level: "Gold" },
  { rank: 4, name: "Neha G.", xp: 4210, level: "Silver" },
  { rank: 5, name: "Rahul P.", xp: 3980, level: "Silver" },
  { rank: 6, name: "Ananya R.", xp: 3750, level: "Silver" },
];

const xpHistory = [
  { date: "17 May", xp: 150, activity: "Completed homework - Math" },
  { date: "16 May", xp: 100, activity: "Quiz participation - Science" },
  { date: "15 May", xp: 200, activity: "Submitted assignment - Physics" },
  { date: "14 May", xp: 50, activity: "Daily login bonus" },
  { date: "13 May", xp: 180, activity: "Perfect score on practice test" },
  { date: "12 May", xp: 120, activity: "Study session - Chemistry" },
];

const consistencyRewards = [
  { days: 7, reward: "🔥 7-Day Streak Badge", earned: true },
  { days: 14, reward: "⚡ 14-Day Streak Badge", earned: true },
  { days: 30, reward: "🌟 30-Day Streak Badge", earned: true },
  { days: 60, reward: "💎 60-Day Streak Badge", earned: false },
  { days: 90, reward: "👑 90-Day Streak Badge", earned: false },
];

export default function Achievements() {
  const earned = allAchievements.filter((a) => a.earned).length;
  const total = allAchievements.length;
  const progress = Math.round((earned / total) * 100);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements & Gamification</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your progress, streaks, and rewards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 shadow-sm text-white">
            <p className="text-sm opacity-90">Total XP</p>
            <p className="text-3xl font-bold mt-1">2,450</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs opacity-90 mb-1">
                <span>Progress to next level</span>
                <span>2,450 / 5,000</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: "49%" }}></div>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold">Level: Silver Scholar</p>
          </div>

          <div className="card bg-gradient-to-br from-red-400 to-pink-500 rounded-xl p-6 shadow-sm text-white">
            <p className="text-sm opacity-90">Daily Streak</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl">🔥</span>
              <span className="text-3xl font-bold">12 Days</span>
            </div>
            <p className="text-sm opacity-90 mt-2">Best streak: 21 days</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl p-6 shadow-sm text-white">
            <p className="text-sm opacity-90">Achievements Unlocked</p>
            <p className="text-3xl font-bold mt-1">{earned}/{total}</p>
            <div className="mt-3">
              <div className="w-full bg-white/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold">{progress}% Complete</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏆 Achievement Badges</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allAchievements.map((ach) => (
                  <div key={ach.id} className={`p-4 rounded-xl text-center transition-all ${
                    ach.earned
                      ? "bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30 border border-yellow-300 dark:border-yellow-700 shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 opacity-60"
                  }`}>
                    <span className="text-3xl block">{ach.emoji}</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">{ach.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{ach.description}</p>
                    {ach.earned ? (
                      <span className="text-[10px] text-green-600 dark:text-green-400 mt-1 block">✅ {ach.earnedDate}</span>
                    ) : (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">🔒 Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Study Consistency Rewards</h2>
              <div className="space-y-3">
                {consistencyRewards.map((reward) => (
                  <div key={reward.days} className={`flex items-center justify-between p-3 rounded-lg ${
                    reward.earned
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${reward.earned ? "" : "opacity-40"}`}>{reward.reward.split(" ")[0]}</span>
                      <div>
                        <p className={`text-sm font-medium ${reward.earned ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{reward.reward}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{reward.days} days of consistency</p>
                      </div>
                    </div>
                    {reward.earned ? <span className="text-green-600 dark:text-green-400 text-sm">✅</span> : <span className="text-gray-400 text-sm">🔒</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏅 Quiz Leaderboard</h2>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.rank <= 3 ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-gray-50 dark:bg-gray-700"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        entry.rank === 1 ? "bg-yellow-500" : entry.rank === 2 ? "bg-gray-400" : entry.rank === 3 ? "bg-orange-500" : "bg-blue-500"
                      }`}>{entry.rank}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</p>
                        <p className="text-xs text-gray-400">{entry.level}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{entry.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 XP Earning History</h2>
              <div className="space-y-3">
                {xpHistory.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{entry.activity}</p>
                      <p className="text-xs text-gray-400">{entry.date}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">+{entry.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
