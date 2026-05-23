import React, { useState } from "react";

const children = [
  { id: 1, name: "Aarav Sharma", class: "10 - A" },
  { id: 2, name: "Ananya Sharma", class: "8 - B" },
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const generateCalendarData = (month, year) => {
  const total = daysInMonth(month, year);
  const days = [];
  for (let d = 1; d <= total; d++) {
    const rand = Math.random();
    if (rand < 0.7) days.push({ day: d, status: "present" });
    else if (rand < 0.85) days.push({ day: d, status: "absent" });
    else days.push({ day: d, status: "late" });
  }
  return days;
};

const monthlySummary = [
  { month: "January", present: 22, absent: 1, late: 2 },
  { month: "February", present: 20, absent: 2, late: 1 },
  { month: "March", present: 23, absent: 0, late: 1 },
  { month: "April", present: 21, absent: 1, late: 2 },
  { month: "May", present: 18, absent: 0, late: 1 },
];

const trendData = [
  { month: "Jan", pct: 92 },
  { month: "Feb", pct: 88 },
  { month: "Mar", pct: 96 },
  { month: "Apr", pct: 90 },
  { month: "May", pct: 94 },
  { month: "Jun", pct: 91 },
];

export default function ChildAttendance() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const month = currentMonth;
  const year = currentYear;
  const calendarDays = generateCalendarData(month, year);
  const firstDay = new Date(year, month, 1).getDay();

  const present = calendarDays.filter((d) => d.status === "present").length;
  const absent = calendarDays.filter((d) => d.status === "absent").length;
  const late = calendarDays.filter((d) => d.status === "late").length;
  const total = calendarDays.length;
  const percentage = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

  const statusColors = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-yellow-500",
  };

  const prevMonth = () => {
    if (month === 0) { setCurrentMonth(11); setCurrentYear(year - 1); }
    else setCurrentMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setCurrentMonth(0); setCurrentYear(year + 1); }
    else setCurrentMonth(month + 1);
  };

  const child = children.find((c) => c.id === selectedChild);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View your child's attendance record</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Attendance</h2>
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray={`${percentage * 2.513} 251.3`} strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Present</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Absent</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Late</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 w-full text-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">{present}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Present</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-2xl font-bold text-red-600">{absent}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Absent</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <p className="text-2xl font-bold text-yellow-600">{late}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Late</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{monthNames[month]} {year}</h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">&larr;</button>
                  <button onClick={nextMonth} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">&rarr;</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {calendarDays.map((d) => (
                  <div key={d.day} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${statusColors[d.status]} text-white`}>
                    {d.day}
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                      <th className="text-left py-2">Month</th>
                      <th className="text-center py-2">Present</th>
                      <th className="text-center py-2">Absent</th>
                      <th className="text-center py-2">Late</th>
                      <th className="text-center py-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySummary.map((m) => {
                      const pct = Math.round((m.present / (m.present + m.absent + m.late)) * 100);
                      return (
                        <tr key={m.month} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 font-medium text-gray-900 dark:text-white">{m.month}</td>
                          <td className="py-3 text-center text-green-600">{m.present}</td>
                          <td className="py-3 text-center text-red-600">{m.absent}</td>
                          <td className="py-3 text-center text-yellow-600">{m.late}</td>
                          <td className="py-3 text-center">
                            <span className={`font-semibold ${pct >= 90 ? "text-green-600" : pct >= 80 ? "text-yellow-600" : "text-red-600"}`}>{pct}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend</h2>
              <div className="flex items-end gap-3 h-40">
                {trendData.map((t) => (
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
        </div>
      </div>
    </div>
  );
}
