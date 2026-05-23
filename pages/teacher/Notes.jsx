import React, { useState } from 'react';

const notesList = [
  { id: 1, title: 'Algebra Basics', class: '10A', subject: 'Mathematics', fileType: 'PDF', uploadedAt: '2026-05-10', visibility: 'Public' },
  { id: 2, title: 'Quadratic Equations', class: '10B', subject: 'Mathematics', fileType: 'PDF', uploadedAt: '2026-05-08', visibility: 'Class Only' },
  { id: 3, title: 'Geometry Diagrams', class: '9A', subject: 'Mathematics', fileType: 'Image', uploadedAt: '2026-05-05', visibility: 'Public' },
  { id: 4, title: 'Trigonometry Table', class: '9B', subject: 'Mathematics', fileType: 'PDF', uploadedAt: '2026-05-01', visibility: 'Private' },
  { id: 5, title: 'Calculus Introduction', class: '10A', subject: 'Mathematics', fileType: 'PDF', uploadedAt: '2026-04-28', visibility: 'Public' },
];

export default function Notes() {
  const [title, setTitle] = useState('');
  const [noteClass, setNoteClass] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Study Notes</h1>
        <p>Upload and manage study notes for your classes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Upload Notes</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" className="input-field w-full" placeholder="Note title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select className="input-field w-full" value={noteClass} onChange={(e) => setNoteClass(e.target.value)}>
                  <option value="">Select Class</option>
                  <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="input-field w-full" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option>Mathematics</option><option>Science</option><option>English</option>
                  <option>History</option><option>Computer Science</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input-field w-full min-h-[80px]" placeholder="Brief description of notes..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select className="input-field w-full" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="Public">Public (All students)</option>
                <option value="Class Only">Class Only</option>
                <option value="Private">Private (Only me)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400">
                <p className="text-gray-500 text-sm">Click to upload PDF or Image</p>
                <p className="text-xs text-gray-400 mt-1">Supported: PDF, PNG, JPG (max 20MB)</p>
                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files[0])} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Upload Notes</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Uploaded Notes</h3>
          <div className="space-y-3">
            {notesList.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{note.title}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{note.fileType}</span>
                </div>
                <p className="text-sm text-gray-600">{note.class} • {note.subject}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`badge-${note.visibility === 'Public' ? 'success' : note.visibility === 'Class Only' ? 'info' : 'warning'} text-xs`}>
                    {note.visibility}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:underline text-xs">View</button>
                    <button className="text-blue-600 hover:underline text-xs">Download</button>
                    <button className="text-red-600 hover:underline text-xs">Delete</button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Uploaded: {note.uploadedAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
