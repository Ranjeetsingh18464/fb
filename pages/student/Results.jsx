import React, { useState } from "react";

const exams = [
  { id: 1, name: "Mid-Term Exams" },
  { id: 2, name: "Final Exams" },
  { id: 3, name: "Weekly Test - Science" },
];

const resultsData = {
  1: {
    subjects: [
      { name: "Mathematics", marks: 88, max: 100, grade: "A" },
      { name: "Physics", marks: 82, max: 100, grade: "A" },
      { name: "Chemistry", marks: 76, max: 100, grade: "B+" },
      { name: "Biology", marks: 90, max: 100, grade: "A+" },
      { name: "English", marks: 85, max: 100, grade: "A" },
      { name: "History", marks: 70, max: 100, grade: "B" },
      { name: "Geography", marks: 78, max: 100, grade: "B+" },
      { name: "Computer", marks: 95, max: 100, grade: "A+" },
    ],
  },
  2: {
    subjects: [
      { name: "Mathematics", marks: 85, max: 100, grade: "A" },
      { name: "Physics", marks: 79, max: 100, grade: "B+" },
      { name: "Chemistry", marks: 80, max: 100, grade: "A" },
      { name: "Biology", marks: 87, max: 100, grade: "A" },
      { name: "English", marks: 82, max: 100, grade: "A" },
      { name: "History", marks: 74, max: 100, grade: "B+" },
      { name: "Geography", marks: 81, max: 100, grade: "A" },
      { name: "Computer", marks: 92, max: 100, grade: "A+" },
    ],
  },
  3: {
    subjects: [
      { name: "Physics", marks: 84, max: 100, grade: "A" },
      { name: "Chemistry", marks: 78, max: 100, grade: "B+" },
      { name: "Biology", marks: 91, max: 100, grade: "A+" },
    ],
  },
};

const gradeColors = {
  "A+": "text-green-600 dark:text-green-400",
  "A": "text-blue-600 dark:text-blue-400",
  "B+": "text-yellow-600 dark:text-yellow-400",
  "B": "text-orange-600 dark:text-orange-400",
  "C": "text-red-600 dark:text-red-400",
};

export default function Results() {
  const [selectedExam, setSelectedExam] = useState(1);
  const current = resultsData[selectedExam] || { subjects: [] };
  const totalMarks = current.subjects.reduce((sum, s) => sum + s.marks, 0);
  const totalMax = current.subjects.reduce((sum, s) => sum + s.max, 0);
  const overallPct = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0;

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Results</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View your academic performance</p>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Exam</h2>
            <select value={selectedExam} onChange={(e) => setSelectedExam(Number(e.target.value))} className="input-field px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subject-wise Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      <th className="text-left p-4">Subject</th>
                      <th className="text-center p-4">Marks</th>
                      <th className="text-center p-4">Max Marks</th>
                      <th className="text-center p-4">Percentage</th>
                      <th className="text-center p-4">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.subjects.map((sub) => (
                      <tr key={sub.name} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-4 font-medium text-gray-900 dark:text-white">{sub.name}</td>
                        <td className="p-4 text-center text-gray-700 dark:text-gray-300">{sub.marks}</td>
                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{sub.max}</td>
                        <td className="p-4 text-center">
                          <span className={`font-semibold ${sub.marks / sub.max >= 0.9 ? "text-green-600" : sub.marks / sub.max >= 0.75 ? "text-blue-600" : sub.marks / sub.max >= 0.6 ? "text-yellow-600" : "text-red-600"}`}>
                            {Math.round((sub.marks / sub.max) * 100)}%
                          </span>
                        </td>
                        <td className={`p-4 text-center font-bold ${gradeColors[sub.grade] || "text-gray-600"}`}>{sub.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Summary</h2>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${overallPct * 2.513} 251.3`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{overallPct}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total: {totalMarks}/{totalMax}</p>
              </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Comparison</h2>
              <div className="space-y-3">
                {current.subjects.map((sub) => (
                  <div key={sub.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{sub.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{Math.round((sub.marks / sub.max) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(sub.marks / sub.max) * 100}%` }}></div>
                    </div>
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
