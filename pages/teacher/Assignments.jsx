import React, { useState } from 'react';

const assignmentList = [
  { id: 1, title: 'Chapter 5 - Exercise Set', class: '10A', subject: 'Mathematics', dueDate: '2026-05-20', submissions: 35, total: 42, status: 'Active' },
  { id: 2, title: 'Algebra Practice Problems', class: '10B', subject: 'Mathematics', dueDate: '2026-05-22', submissions: 28, total: 38, status: 'Active' },
  { id: 3, title: 'Geometry Construction', class: '9A', subject: 'Mathematics', dueDate: '2026-05-18', submissions: 32, total: 40, status: 'Active' },
  { id: 4, title: 'Statistics Project', class: '9B', subject: 'Mathematics', dueDate: '2026-05-15', submissions: 36, total: 36, status: 'Completed' },
  { id: 5, title: 'Revision Worksheet', class: '10A', subject: 'Mathematics', dueDate: '2026-05-12', submissions: 40, total: 42, status: 'Completed' },
];

const submissionsData = [
  { id: 1, name: 'Aarav Sharma', rollNo: '01', submitted: true, marks: 85, graded: true },
  { id: 2, name: 'Bhavya Patel', rollNo: '02', submitted: true, marks: 0, graded: false },
  { id: 3, name: 'Chirag Singh', rollNo: '03', submitted: true, marks: 72, graded: true },
  { id: 4, name: 'Divya Verma', rollNo: '04', submitted: false, marks: 0, graded: false },
  { id: 5, name: 'Ekta Joshi', rollNo: '05', submitted: true, marks: 0, graded: false },
];

export default function Assignments() {
  const [title, setTitle] = useState('');
  const [assignClass, setAssignClass] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Assignments</h1>
        <p>Create and manage assignments with submission tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Create Assignment</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" className="input-field w-full" placeholder="Assignment title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select className="input-field w-full" value={assignClass} onChange={(e) => setAssignClass(e.target.value)}>
                  <option value="">Select</option>
                  <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select className="input-field w-full" value={section} onChange={(e) => setSection(e.target.value)}>
                  <option value="">Select</option>
                  <option>A</option><option>B</option><option>C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="input-field w-full" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option>Mathematics</option><option>Science</option><option>English</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" className="input-field w-full" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input-field w-full min-h-[80px]" placeholder="Assignment description..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400">
                <p className="text-gray-500 text-sm">Click to upload file</p>
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Create Assignment</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Assignment List</h3>
          <div className="space-y-3">
            {assignmentList.map((a) => (
              <div
                key={a.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${selectedAssignment === a.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setSelectedAssignment(a.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{a.title}</p>
                  <span className={`badge-${a.status === 'Active' ? 'success' : 'info'} text-xs`}>{a.status}</span>
                </div>
                <p className="text-sm text-gray-600">{a.class} • {a.subject}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Due: {a.dueDate}</span>
                  <span>{a.submissions}/{a.total} submitted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAssignment && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">
            Submissions - {assignmentList.find((a) => a.id === selectedAssignment)?.title}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-sm">#</th>
                  <th className="py-3 px-4 font-semibold text-sm">Roll No</th>
                  <th className="py-3 px-4 font-semibold text-sm">Name</th>
                  <th className="py-3 px-4 font-semibold text-sm">Submitted</th>
                  <th className="py-3 px-4 font-semibold text-sm">Marks</th>
                  <th className="py-3 px-4 font-semibold text-sm">Grade</th>
                </tr>
              </thead>
              <tbody>
                {submissionsData.map((s, idx) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4">{s.rollNo}</td>
                    <td className="py-3 px-4 font-medium">{s.name}</td>
                    <td className="py-3 px-4">
                      <span className={`badge-${s.submitted ? 'success' : 'danger'} text-xs`}>
                        {s.submitted ? 'Submitted' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {s.submitted ? (
                        <input type="number" className="input-field w-20" defaultValue={s.marks || ''} min="0" max="100" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{s.graded ? 'Graded' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
