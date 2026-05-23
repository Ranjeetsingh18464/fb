import React, { useState } from "react";

const children = [
  { id: 1, name: "Aarav Sharma", class: "10 - A" },
  { id: 2, name: "Ananya Sharma", class: "8 - B" },
];

const subjectColorMap = {
  Mathematics: "bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500",
  Physics: "bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500",
  Chemistry: "bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500",
  English: "bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500",
  Biology: "bg-teal-100 dark:bg-teal-900/40 border-l-4 border-teal-500",
  History: "bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500",
  Geography: "bg-indigo-100 dark:bg-indigo-900/40 border-l-4 border-indigo-500",
  Computer: "bg-pink-100 dark:bg-pink-900/40 border-l-4 border-pink-500",
  Physical: "bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500",
  Art: "bg-cyan-100 dark:bg-cyan-900/40 border-l-4 border-cyan-500",
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timetableData = {
  "Monday": [
    { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "08:45 - 09:30", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
    { time: "09:30 - 10:15", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
    { time: "10:30 - 11:15", subject: "English", teacher: "Ms. Singh", room: "104" },
    { time: "11:15 - 12:00", subject: "Biology", teacher: "Dr. Patel", room: "301" },
    { time: "13:00 - 13:45", subject: "Computer", teacher: "Mr. Kumar", room: "Lab 2" },
  ],
  "Tuesday": [
    { time: "08:00 - 08:45", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
    { time: "08:45 - 09:30", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "09:30 - 10:15", subject: "History", teacher: "Mr. Singh", room: "106" },
    { time: "10:30 - 11:15", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
    { time: "11:15 - 12:00", subject: "Geography", teacher: "Mrs. Nair", room: "108" },
    { time: "13:00 - 13:45", subject: "Physical", teacher: "Mr. Sports", room: "Ground" },
  ],
  "Wednesday": [
    { time: "08:00 - 08:45", subject: "Biology", teacher: "Dr. Patel", room: "301" },
    { time: "08:45 - 09:30", subject: "English", teacher: "Ms. Singh", room: "104" },
    { time: "09:30 - 10:15", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "10:30 - 11:15", subject: "Computer", teacher: "Mr. Kumar", room: "Lab 2" },
    { time: "11:15 - 12:00", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
    { time: "13:00 - 13:45", subject: "Art", teacher: "Ms. Artist", room: "Art Room" },
  ],
  "Thursday": [
    { time: "08:00 - 08:45", subject: "Geography", teacher: "Mrs. Nair", room: "108" },
    { time: "08:45 - 09:30", subject: "History", teacher: "Mr. Singh", room: "106" },
    { time: "09:30 - 10:15", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "10:30 - 11:15", subject: "Biology", teacher: "Dr. Patel", room: "301" },
    { time: "11:15 - 12:00", subject: "English", teacher: "Ms. Singh", room: "104" },
    { time: "13:00 - 13:45", subject: "Physics", teacher: "Mrs. Gupta", room: "203" },
  ],
  "Friday": [
    { time: "08:00 - 08:45", subject: "Computer", teacher: "Mr. Kumar", room: "Lab 2" },
    { time: "08:45 - 09:30", subject: "Chemistry", teacher: "Mr. Verma", room: "205" },
    { time: "09:30 - 10:15", subject: "Mathematics", teacher: "Dr. Sharma", room: "101" },
    { time: "10:30 - 11:15", subject: "Geography", teacher: "Mrs. Nair", room: "108" },
    { time: "11:15 - 12:00", subject: "Art", teacher: "Ms. Artist", room: "Art Room" },
  ],
};

const allPeriods = ["08:00 - 08:45", "08:45 - 09:30", "09:30 - 10:15", "10:30 - 11:15", "11:15 - 12:00", "13:00 - 13:45"];

const subjectBadgeColors = {
  Mathematics: "bg-blue-500",
  Physics: "bg-purple-500",
  Chemistry: "bg-green-500",
  English: "bg-yellow-500",
  Biology: "bg-teal-500",
  History: "bg-orange-500",
  Geography: "bg-indigo-500",
  Computer: "bg-pink-500",
  Physical: "bg-red-500",
  Art: "bg-cyan-500",
};

export default function ChildTimetable() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  const [activeDay, setActiveDay] = useState("Monday");

  const child = children.find((c) => c.id === selectedChild);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Class Timetable</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View your child's weekly schedule</p>
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{activeDay} Schedule</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{timetableData[activeDay].length} periods scheduled</p>
          </div>
          <div className="p-4 space-y-3">
            {timetableData[activeDay].map((period, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${subjectColorMap[period.subject] || "bg-gray-100 dark:bg-gray-700"} transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${subjectBadgeColors[period.subject] || "bg-gray-500"}`}></span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm">
                        {period.time}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{period.subject}</h3>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>Teacher: {period.teacher}</span>
                      <span>Room: {period.room}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Period {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 w-32">Time</th>
                  {days.map((day) => (
                    <th key={day} className={`text-center py-2 px-2 ${activeDay === day ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPeriods.map((period, idx) => (
                  <tr key={period} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400 font-medium">{period}</td>
                    {days.map((day) => {
                      const entry = timetableData[day].find((p) => p.time === period);
                      return (
                        <td key={day} className="py-2 px-1 text-center">
                          {entry ? (
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${subjectBadgeColors[entry.subject] || "bg-gray-500"}`}>
                              {entry.subject.substring(0, 4)}
                            </span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
