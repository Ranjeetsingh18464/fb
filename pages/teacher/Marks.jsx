import React, { useState } from 'react';

const studentMarks = [
  { id: 1, name: 'Aarav Sharma', rollNo: '01', marks: 0, total: 100, grade: '' },
  { id: 2, name: 'Bhavya Patel', rollNo: '02', marks: 0, total: 100, grade: '' },
  { id: 3, name: 'Chirag Singh', rollNo: '03', marks: 0, total: 100, grade: '' },
  { id: 4, name: 'Divya Verma', rollNo: '04', marks: 0, total: 100, grade: '' },
  { id: 5, name: 'Ekta Joshi', rollNo: '05', marks: 0, total: 100, grade: '' },
  { id: 6, name: 'Farhan Khan', rollNo: '06', marks: 0, total: 100, grade: '' },
  { id: 7, name: 'Gauri Reddy', rollNo: '07', marks: 0, total: 100, grade: '' },
  { id: 8, name: 'Harsh Gupta', rollNo: '08', marks: 0, total: 100, grade: '' },
  { id: 9, name: 'Isha Patel', rollNo: '09', marks: 0, total: 100, grade: '' },
  { id: 10, name: 'Jayesh Kumar', rollNo: '10', marks: 0, total: 100, grade: '' },
];

const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  return 'F';
};

export default function Marks() {
  const [students, setStudents] = useState(studentMarks);
  const [examType, setExamType] = useState('Mid-Term');

  const updateMarks = (id, value) => {
    const marks = Math.min(100, Math.max(0, Number(value) || 0));
    const percentage = (marks / 100) * 100;
    const grade = calculateGrade(percentage);
    setStudents(students.map((s) => (s.id === id ? { ...s, marks, grade } : s)));
  };

  const handleSave = () => {
    setStudents(students.map((s) => {
      const percentage = (s.marks / s.total) * 100;
      return { ...s, grade: calculateGrade(percentage) };
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Marks Entry</h1>
        <p>Enter and manage student examination marks.</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select className="input-field">
              <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <select className="input-field">
              <option>A</option><option>B</option><option>C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select className="input-field">
              <option>Mathematics</option><option>Science</option><option>English</option>
              <option>History</option><option>Computer Science</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
            <select className="input-field" value={examType} onChange={(e) => setExamType(e.target.value)}>
              <option>Mid-Term</option><option>Final</option><option>Unit Test</option><option>Quiz</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleSave}>Save Marks</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 font-semibold text-sm">#</th>
              <th className="py-3 px-4 font-semibold text-sm">Roll No</th>
              <th className="py-3 px-4 font-semibold text-sm">Student Name</th>
              <th className="py-3 px-4 font-semibold text-sm">Marks</th>
              <th className="py-3 px-4 font-semibold text-sm">Total</th>
              <th className="py-3 px-4 font-semibold text-sm">Percentage</th>
              <th className="py-3 px-4 font-semibold text-sm">Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const percentage = student.total > 0 ? ((student.marks / student.total) * 100).toFixed(1) : 0;
              return (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">{student.rollNo}</td>
                  <td className="py-3 px-4 font-medium">{student.name}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      className="input-field w-20"
                      min="0"
                      max="100"
                      value={student.marks || ''}
                      onChange={(e) => updateMarks(student.id, e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">{student.total}</td>
                  <td className="py-3 px-4 font-semibold">{percentage}%</td>
                  <td className="py-3 px-4">
                    <span className={`badge-${student.grade === 'F' ? 'danger' : student.grade === 'A+' || student.grade === 'A' ? 'success' : student.grade === '' ? 'info' : 'warning'}`}>
                      {student.grade || '-'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
