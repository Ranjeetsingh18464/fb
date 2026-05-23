import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialTeachers = [
  { id: 1, name: 'Ms. Priya Sharma', subject: 'Mathematics', classes: ['10A', '10B', '9A'], performance: 4.8, status: 'Active' },
  { id: 2, name: 'Mr. Rajesh Kumar', subject: 'Science', classes: ['10A', '9B', '8A'], performance: 4.6, status: 'Active' },
  { id: 3, name: 'Mrs. Anita Verma', subject: 'English', classes: ['10A', '10B', '9A'], performance: 4.5, status: 'Active' },
  { id: 4, name: 'Mr. Vikram Singh', subject: 'History', classes: ['9A', '9B', '8A'], performance: 4.3, status: 'Active' },
  { id: 5, name: 'Ms. Neha Gupta', subject: 'Computer Science', classes: ['10A', '9A', '8B'], performance: 4.2, status: 'Active' },
  { id: 6, name: 'Mr. Amit Joshi', subject: 'Physics', classes: ['11A', '11B'], performance: 4.0, status: 'On Leave' },
  { id: 7, name: 'Mrs. Sunita Reddy', subject: 'Chemistry', classes: ['11A', '12A'], performance: 4.7, status: 'Active' },
  { id: 8, name: 'Mr. Deepak Patel', subject: 'Physical Education', classes: ['6A', '7A', '8A'], performance: 4.1, status: 'Active' },
];

export default function Teachers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [teachers, setTeachers] = useState(initialTeachers);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newClasses, setNewClasses] = useState('');
  const [viewTeacher, setViewTeacher] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editClasses, setEditClasses] = useState('');

  const handleAddTeacher = () => {
    if (!newName || !newSubject) return;
    const teacher = {
      id: Date.now(),
      name: newName,
      subject: newSubject,
      classes: newClasses.split(',').map(c => c.trim()).filter(Boolean),
      performance: 4.0,
      status: 'Active'
    };
    setTeachers([teacher, ...teachers]);
    setNewName(''); setNewSubject(''); setNewClasses('');
    setShowForm(false);
  };

  const filtered = teachers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subjectFilter || t.subject === subjectFilter;
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchSubject && matchStatus;
  });

  const subjects = [...new Set(teachers.map((t) => t.subject))];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/principal')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1>Teachers</h1>
            <p>Manage all teachers in your school.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or subject..."
          className="input-field flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field w-44"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="input-field w-36"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">+ Add Teacher</button>
      </div>

      {showForm && (
        <div className="card mb-6 p-4">
          <h3 className="font-semibold mb-4">New Teacher</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input value={newName} onChange={e => setNewName(e.target.value)} className="input-field" placeholder="Full name" />
            <input value={newSubject} onChange={e => setNewSubject(e.target.value)} className="input-field" placeholder="Subject" />
            <input value={newClasses} onChange={e => setNewClasses(e.target.value)} className="input-field" placeholder="Classes (comma separated)" />
            <div className="flex gap-2">
              <button onClick={handleAddTeacher} className="btn-primary flex-1">Add</button>
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4 font-semibold text-sm">Name</th>
              <th className="py-3 px-4 font-semibold text-sm">Subject</th>
              <th className="py-3 px-4 font-semibold text-sm">Classes</th>
              <th className="py-3 px-4 font-semibold text-sm">Performance</th>
              <th className="py-3 px-4 font-semibold text-sm">Status</th>
              <th className="py-3 px-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((teacher) => (
              <tr key={teacher.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 font-medium">{teacher.name}</td>
                <td className="py-3 px-4">{teacher.subject}</td>
                <td className="py-3 px-4">{teacher.classes.join(', ')}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div
                        className="bg-green-500 rounded-full h-1.5"
                        style={{ width: `${(teacher.performance / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{teacher.performance}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      const updated = teachers.map(t =>
                        t.id === teacher.id ? { ...t, status: t.status === 'Active' ? 'On Leave' : 'Active' } : t
                      );
                      setTeachers(updated);
                    }}
                    className={`badge-${teacher.status === 'Active' ? 'success' : 'warning'} cursor-pointer`}
                  >
                    {teacher.status}
                  </button>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button onClick={() => setViewTeacher(teacher)} className="text-blue-600 hover:underline text-sm">View</button>
                  <button onClick={() => { setEditId(teacher.id); setEditName(teacher.name); setEditSubject(teacher.subject); setEditClasses(teacher.classes.join(', ')); }} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => { if (confirm('Remove this teacher?')) setTeachers(teachers.filter(t => t.id !== teacher.id)); }} className="text-red-600 hover:underline text-sm">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewTeacher(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{viewTeacher.name}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Subject:</span> {viewTeacher.subject}</p>
              <p><span className="font-medium">Classes:</span> {viewTeacher.classes.join(', ')}</p>
              <p><span className="font-medium">Performance:</span> {viewTeacher.performance}/5</p>
              <p><span className="font-medium">Status:</span> {viewTeacher.status}</p>
            </div>
            <button onClick={() => setViewTeacher(null)} className="btn-primary mt-4 w-full">Close</button>
          </div>
        </div>
      )}

      {editId && (() => {
        const t = teachers.find(x => x.id === editId);
        if (!t) return null;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditId(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">Edit Teacher</h3>
              <div className="space-y-3">
                <input value={editName} onChange={e => setEditName(e.target.value)} className="input-field w-full" placeholder="Name" />
                <input value={editSubject} onChange={e => setEditSubject(e.target.value)} className="input-field w-full" placeholder="Subject" />
                <input value={editClasses} onChange={e => setEditClasses(e.target.value)} className="input-field w-full" placeholder="Classes (comma separated)" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => {
                  setTeachers(teachers.map(x => x.id === editId ? { ...x, name: editName, subject: editSubject, classes: editClasses.split(',').map(c => c.trim()).filter(Boolean) } : x));
                  setEditId(null);
                }} className="btn-primary flex-1">Save</button>
                <button onClick={() => setEditId(null)} className="btn-outline flex-1">Cancel</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
