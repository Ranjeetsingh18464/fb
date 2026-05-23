import React, { useState } from 'react';

const homeworkList = [
  { id: 1, title: 'Chapter 5 Exercises', class: '10A', subject: 'Mathematics', dueDate: '2026-05-20', status: 'Active', submissions: 35 },
  { id: 2, title: 'Algebra Worksheet', class: '10B', subject: 'Mathematics', dueDate: '2026-05-22', status: 'Active', submissions: 28 },
  { id: 3, title: 'Geometry Problems', class: '9A', subject: 'Mathematics', dueDate: '2026-05-18', status: 'Overdue', submissions: 30 },
  { id: 4, title: 'Statistics Assignment', class: '9B', subject: 'Mathematics', dueDate: '2026-05-15', status: 'Completed', submissions: 32 },
  { id: 5, title: 'Practice Test', class: '10A', subject: 'Mathematics', dueDate: '2026-05-12', status: 'Completed', submissions: 40 },
];

export default function Homework() {
  const [title, setTitle] = useState('');
  const [hwClass, setHwClass] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [files, setFiles] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Homework</h1>
        <p>Create and manage homework assignments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Create Homework</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select className="input-field w-full" value={hwClass} onChange={(e) => setHwClass(e.target.value)}>
                  <option value="">Select Class</option>
                  <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select className="input-field w-full" value={section} onChange={(e) => setSection(e.target.value)}>
                  <option value="">Select Section</option>
                  <option>A</option><option>B</option><option>C</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="input-field w-full" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option>Mathematics</option><option>Science</option><option>English</option>
                  <option>History</option><option>Computer Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="input-field w-full" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" className="input-field w-full" placeholder="Homework title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input-field w-full min-h-[80px]" placeholder="Describe the homework..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" className="input-field w-full" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="input-field w-full" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400">
                <p className="text-gray-500 text-sm">Drag & drop files here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, Images (max 10MB)</p>
                <input type="file" className="hidden" multiple onChange={(e) => setFiles(e.target.files)} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Assign Homework</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Homework List</h3>
          <div className="space-y-3">
            {homeworkList.map((hw) => (
              <div key={hw.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{hw.title}</h4>
                  <span className={`badge-${hw.status === 'Active' ? 'success' : hw.status === 'Overdue' ? 'danger' : 'info'} text-xs`}>
                    {hw.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{hw.class} • {hw.subject}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Due: {hw.dueDate}</span>
                  <span>{hw.submissions} submissions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
