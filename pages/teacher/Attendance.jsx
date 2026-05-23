import React, { useState } from 'react';

const studentData = [
  { id: 1, name: 'Aarav Sharma', rollNo: '01', status: '' },
  { id: 2, name: 'Bhavya Patel', rollNo: '02', status: '' },
  { id: 3, name: 'Chirag Singh', rollNo: '03', status: '' },
  { id: 4, name: 'Divya Verma', rollNo: '04', status: '' },
  { id: 5, name: 'Ekta Joshi', rollNo: '05', status: '' },
  { id: 6, name: 'Farhan Khan', rollNo: '06', status: '' },
  { id: 7, name: 'Gauri Reddy', rollNo: '07', status: '' },
  { id: 8, name: 'Harsh Gupta', rollNo: '08', status: '' },
  { id: 9, name: 'Isha Patel', rollNo: '09', status: '' },
  { id: 10, name: 'Jayesh Kumar', rollNo: '10', status: '' },
];

export default function Attendance() {
  const [students, setStudents] = useState(studentData);
  const [selectedClass, setSelectedClass] = useState('10A');
  const [selectedSection, setSelectedSection] = useState('A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const setStatus = (id, status) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const bulkAction = (status) => {
    setStudents(students.map((s) => ({ ...s, status })));
  };

  const presentCount = students.filter((s) => s.status === 'Present').length;
  const absentCount = students.filter((s) => s.status === 'Absent').length;
  const lateCount = students.filter((s) => s.status === 'Late').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Mark and manage student attendance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Late</p>
          <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{students.length}</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select className="input-field" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <select className="input-field" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              <option>A</option><option>B</option><option>C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="flex gap-2 ml-auto items-end">
            <button className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600" onClick={() => bulkAction('Present')}>All Present</button>
            <button className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600" onClick={() => bulkAction('Absent')}>All Absent</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300" onClick={() => bulkAction('')}>Reset</button>
            <button className="btn-primary">Save Attendance</button>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 font-semibold text-sm">#</th>
              <th className="py-3 px-4 font-semibold text-sm">Roll No</th>
              <th className="py-3 px-4 font-semibold text-sm">Student Name</th>
              <th className="py-3 px-4 font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">{student.rollNo}</td>
                <td className="py-3 px-4 font-medium">{student.name}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${student.status === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'}`}
                      onClick={() => setStatus(student.id, 'Present')}
                    >
                      Present
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${student.status === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-100'}`}
                      onClick={() => setStatus(student.id, 'Absent')}
                    >
                      Absent
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${student.status === 'Late' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}`}
                      onClick={() => setStatus(student.id, 'Late')}
                    >
                      Late
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
