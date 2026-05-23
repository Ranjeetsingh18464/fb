import { useState } from "react";
import { useNavigate } from "react-router-dom";

const resultsData = [
  { rank: 1, name: "Alice Johnson", marks: 96 },
  { rank: 2, name: "Bob Smith", marks: 88 },
  { rank: 3, name: "Charlie Brown", marks: 82 },
  { rank: 4, name: "Diana Prince", marks: 79 },
  { rank: 5, name: "Edward Norton", marks: 74 },
];

export default function Results() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("Midterm");
  const [published, setPublished] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Results
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              <option value="">Select class</option>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Section</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              <option value="">Select section</option>
              {["A", "B", "C", "D", "E"].map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Exam</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option>Midterm</option>
              <option>Final</option>
              <option>Quiz</option>
            </select>
          </div>
        </div>

        {selectedClass && selectedSection && subject && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 text-gray-500 dark:text-gray-400 font-medium">Rank</th>
                    <th className="text-left p-4 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                    <th className="text-left p-4 text-gray-500 dark:text-gray-400 font-medium">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsData.map((r) => (
                    <tr key={r.rank} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <td className="p-4">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          r.rank === 1
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            : r.rank === 2
                            ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                            : r.rank === 3
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}>
                          {r.rank}
                        </span>
                      </td>
                      <td className="p-4 text-gray-900 dark:text-white">{r.name}</td>
                      <td className="p-4 text-gray-900 dark:text-white font-medium">{r.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setPublished(!published)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  published
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {published ? "Unpublish Results" : "Publish Results"}
              </button>
              {published && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  &check; Published
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
