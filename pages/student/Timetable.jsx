import React, { useState } from "react";

const subjectColors = {
  Mathematics: "bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500",
  Physics: "bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500",
  Chemistry: "bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500",
  English: "bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500",
  Biology: "bg-teal-100 dark:bg-teal-900/40 border-l-4 border-teal-500",
  History: "bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500",
  Geography: "bg-indigo-100 dark:bg-indigo-900/40 border-l-4 border-indigo-500",
  Computer: "bg-pink-100 dark:bg-pink-900/40 border-l-4 border-pink-500",
};

const timetableData = {
  Monday: [
    { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "08:45 - 09:30", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
    { time: "09:30 - 10:15", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
    { time: "10:30 - 11:15", subject: "English", teacher: "Ms. Singh", room: "104" },
    { time: "11:15 - 12:00", subject: "Biology", teacher: "Dr. Patel", room: "301" },
    { time: "13:00 - 13:45", subject: "Computer", teacher: "Mr. Kumar", room: "Lab 2" },
  ],
  Tuesday: [
    { time: "08:00 - 08:45", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
    { time: "08:45 - 09:30", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "09:30 - 10:15", subject: "History", teacher: "Mr. Singh", room: "106" },
    { time: "10:30 - 11:15", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
    { time: "11:15 - 12:00", subject: "Geography", teacher: "Mrs. Nair", room: "108" },
    { time: "13:00 - 13:45", subject: "English", teacher: "Ms. Singh", room: "104" },
  ],
  Wednesday: [
    { time: "08:00 - 08:45", subject: "Biology", teacher: "Dr. Patel", room: "301" },
    { time: "08:45 - 09:30", subject: "English", teacher: "Ms. Singh", room: "104" },
    { time: "09:30 - 10:15", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "10:30 - 11:15", subject: "Computer", teacher: "Mr. Kumar", room: "Lab 2" },
    { time: "11:15 - 12:00", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
    { time: "13:00 - 13:45", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
  ],
  Thursday: [
    { time: "08:00 - 08:45", subject: "Geography", teacher: "Mrs. Nair", room: "108" },
    { time: "08:45 - 09:30", subject: "History", teacher: "Mr. Singh", room: "106" },
    { time: "09:30 - 10:15", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "10:30 - 11:15", subject: "Biology", teacher: "Dr. Patel", room: "301" },
    { time: "11:15 - 12:00", subject: "English", teacher: "Ms. Singh", room: "104" },
    { time: "13:00 - 13:45", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
  ],
  Friday: [
    { time: "08:00 - 08:45", subject: "Computer", teacher: "Mr. Kumar", room: "Lab 2" },
    { time: "08:45 - 09:30", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
    { time: "09:30 - 10:15", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "10:30 - 11:15", subject: "Geography", teacher: "Mrs. Nair", room: "108" },
    { time: "11:15 - 12:00", subject: "History", teacher: "Mr. Singh", room: "106" },
  ],
};

export default function Timetable() {
  const [activeDay, setActiveDay] = useState("Monday");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Timetable</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your weekly class schedule</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {days.map((day) => (
            <button key={day} onClick={() => setActiveDay(day)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeDay === day
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}>{day}</button>
          ))}
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{activeDay}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{timetableData[activeDay].length} periods scheduled</p>
          </div>
          <div className="p-4 space-y-3">
            {timetableData[activeDay].map((period, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${subjectColors[period.subject] || "bg-gray-100 dark:bg-gray-700"} transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm">
                        {period.time}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{period.subject}</h3>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>👨‍🏫 {period.teacher}</span>
                      <span>🚪 Room {period.room}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Period {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
