import React, { useState } from "react";

const exams = [
  { id: 1, subject: "Mathematics", date: "20 May 2026", time: "10:00 AM - 12:00 PM", duration: "2 hours", syllabus: "Quadratic Equations, Linear Equations, Polynomials, Coordinate Geometry" },
  { id: 2, subject: "Physics", date: "22 May 2026", time: "10:00 AM - 11:30 AM", duration: "1.5 hours", syllabus: "Laws of Motion, Work & Energy, Gravitation" },
  { id: 3, subject: "Chemistry", date: "24 May 2026", time: "10:00 AM - 11:30 AM", duration: "1.5 hours", syllabus: "Periodic Table, Chemical Bonding, Acids & Bases" },
  { id: 4, subject: "Biology", date: "26 May 2026", time: "10:00 AM - 11:30 AM", duration: "1.5 hours", syllabus: "Cell Division, Human Digestive System, Respiration" },
  { id: 5, subject: "English", date: "28 May 2026", time: "10:00 AM - 12:00 PM", duration: "2 hours", syllabus: "Grammar, Essay Writing, Comprehension, Literature" },
  { id: 6, subject: "History", date: "30 May 2026", time: "10:00 AM - 11:30 AM", duration: "1.5 hours", syllabus: "World War I & II, Indus Valley Civilization, Indian Freedom Movement" },
];

const examDates = [
  { subject: "Mathematics", date: new Date(2026, 4, 20) },
  { subject: "Physics", date: new Date(2026, 4, 22) },
  { subject: "Chemistry", date: new Date(2026, 4, 24) },
  { subject: "Biology", date: new Date(2026, 4, 26) },
  { subject: "English", date: new Date(2026, 4, 28) },
  { subject: "History", date: new Date(2026, 4, 30) },
];

function getCountdown() {
  const now = new Date();
  const next = examDates.find((e) => e.date > now);
  if (!next) return null;
  const diff = next.date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { subject: next.subject, days, hours };
}

const tips = [
  "Create a study schedule and stick to it — consistency beats cramming.",
  "Practice past exam papers to understand question patterns.",
  "Take short breaks every 45-60 minutes to maintain focus.",
  "Stay hydrated and get at least 7-8 hours of sleep before exams.",
  "Review your notes the night before and do light revision on exam day.",
  "Focus on understanding concepts rather than rote memorization.",
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ExamSchedule() {
  const countdown = getCountdown();
  const [currentMonth, setCurrentMonth] = useState(4);
  const [currentYear, setCurrentYear] = useState(2026);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const getExamForDay = (day) => {
    return examDates.find((e) => {
      return e.date.getDate() === day && e.date.getMonth() === currentMonth && e.date.getFullYear() === currentYear;
    });
  };

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View upcoming exams and prepare effectively</p>
        </div>

        {countdown && (
          <div className="card bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-sm text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Next Exam</p>
                <p className="text-2xl font-bold mt-1">{countdown.subject}</p>
                <p className="text-sm opacity-90 mt-1">Get ready! Your exam is approaching</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold">{countdown.days}</div>
                <p className="text-sm opacity-90">days</p>
                <p className="text-lg font-semibold">{countdown.hours} hours</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: "35%" }}></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exam Schedule</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {exams.map((exam) => (
                  <div key={exam.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.subject}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            exam.subject === "Mathematics" ? "bg-blue-100 dark:bg-blue-900 text-blue-700" :
                            exam.subject === "Physics" ? "bg-purple-100 dark:bg-purple-900 text-purple-700" :
                            exam.subject === "Chemistry" ? "bg-green-100 dark:bg-green-900 text-green-700" :
                            exam.subject === "Biology" ? "bg-teal-100 dark:bg-teal-900 text-teal-700" :
                            exam.subject === "English" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700" :
                            "bg-orange-100 dark:bg-orange-900 text-orange-700"
                          }`}>{exam.subject}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>📅 {exam.date}</span>
                          <span>⏰ {exam.time}</span>
                          <span>⏱ {exam.duration}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span className="font-medium">Topics:</span> {exam.syllabus}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{months[currentMonth]} {currentYear}</h2>
                <div className="flex gap-1">
                  <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); }} className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm">&larr;</button>
                  <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); }} className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm">&rarr;</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const exam = getExamForDay(day);
                  return (
                    <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium ${
                      exam ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                      <span>{day}</span>
                      {exam && <span className="text-[8px] leading-tight mt-0.5">📝</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Preparation Tips</h2>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <p className="text-gray-600 dark:text-gray-400">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Total Exams</span><span className="font-bold text-gray-900 dark:text-white">6</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Subjects</span><span className="font-bold text-gray-900 dark:text-white">6</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Total Duration</span><span className="font-bold text-gray-900 dark:text-white">10.5 hours</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">First Exam</span><span className="font-bold text-gray-900 dark:text-white">20 May</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Last Exam</span><span className="font-bold text-gray-900 dark:text-white">30 May</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
