import React, { useState } from 'react';

const results = [
  { id: 1, title: 'Mid-Term 2026', class: '10A', exam: 'Mid-Term', published: true, date: '2026-04-15', students: 42 },
  { id: 2, title: 'Unit Test 1', class: '10B', exam: 'Unit Test', published: true, date: '2026-03-20', students: 38 },
  { id: 3, title: 'Final Prep Test', class: '9A', exam: 'Quiz', published: false, date: '2026-05-10', students: 40 },
  { id: 4, title: 'Weekly Test', class: '9B', exam: 'Quiz', published: false, date: '2026-05-12', students: 36 },
];

const studentResults = [
  { rank: 1, name: 'Aarav Sharma', rollNo: '01', marks: 95, grade: 'A+' },
  { rank: 2, name: 'Divya Verma', rollNo: '04', marks: 88, grade: 'A' },
  { rank: 3, name: 'Gauri Reddy', rollNo: '07', marks: 82, grade: 'A' },
  { rank: 4, name: 'Jayesh Kumar', rollNo: '10', marks: 78, grade: 'B+' },
  { rank: 5, name: 'Ekta Joshi', rollNo: '05', marks: 75, grade: 'B+' },
  { rank: 6, name: 'Chirag Singh', rollNo: '03', marks: 72, grade: 'B' },
  { rank: 7, name: 'Harsh Gupta', rollNo: '08', marks: 68, grade: 'B' },
  { rank: 8, name: 'Bhavya Patel', rollNo: '02', marks: 65, grade: 'C+' },
  { rank: 9, name: 'Farhan Khan', rollNo: '06', marks: 58, grade: 'C+' },
  { rank: 10, name: 'Isha Patel', rollNo: '09', marks: 52, grade: 'C+' },
];

export default function Results() {
  const [selectedResult, setSelectedResult] = useState(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Results Management</h1>
        <p>Generate and manage student results.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <select className="input-field w-44">
            <option value="">All Classes</option>
            <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
          </select>
          <select className="input-field w-44">
            <option value="">All Exam Types</option>
            <option>Mid-Term</option><option>Final</option><option>Unit Test</option><option>Quiz</option>
          </select>
        </div>
        <button className="btn-primary">+ Generate Results</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card">
          <h3 className="font-semibold text-lg mb-4">Result History</h3>
          <div className="space-y-3">
            {results.map((r) => (
              <div
                key={r.id}
                className={`border rounded-lg p-3 cursor-pointer transition ${selectedResult === r.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setSelectedResult(r.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{r.title}</p>
                  <span className={`badge-${r.published ? 'success' : 'warning'} text-xs`}>
                    {r.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{r.class} • {r.exam}</p>
                <p className="text-xs text-gray-400 mt-1">{r.date} • {r.students} students</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {selectedResult ? results.find((r) => r.id === selectedResult)?.title : 'Result Details'}
            </h3>
            {selectedResult && (
              <div className="flex gap-2">
                <button className="btn-primary text-sm">Publish Result</button>
                <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">Download</button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-sm">Rank</th>
                  <th className="py-3 px-4 font-semibold text-sm">Roll No</th>
                  <th className="py-3 px-4 font-semibold text-sm">Name</th>
                  <th className="py-3 px-4 font-semibold text-sm">Marks</th>
                  <th className="py-3 px-4 font-semibold text-sm">Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((s) => (
                  <tr key={s.rank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{s.rank}</td>
                    <td className="py-3 px-4">{s.rollNo}</td>
                    <td className="py-3 px-4 font-medium">{s.name}</td>
                    <td className="py-3 px-4">{s.marks}</td>
                    <td className="py-3 px-4">
                      <span className={`badge-${s.grade === 'A+' || s.grade === 'A' ? 'success' : s.grade === 'F' ? 'danger' : 'warning'}`}>
                        {s.grade}
                      </span>
                    </td>
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
