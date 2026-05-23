import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialAnnouncements = [
  { id: 1, title: 'Summer Vacation Notice', content: 'School will remain closed from May 20 to June 30 for summer break.', priority: 'High', date: '2026-05-10', author: 'Principal' },
  { id: 2, title: 'PTA Meeting Scheduled', content: 'Parent-Teacher meeting for classes 10 & 12 on April 15.', priority: 'Medium', date: '2026-04-05', author: 'Principal' },
  { id: 3, title: 'New Library Hours', content: 'Library will now remain open till 5 PM on weekdays.', priority: 'Low', date: '2026-03-20', author: 'Principal' },
];

export default function Announcements() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [editId, setEditId] = useState(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAuthor, setNewAuthor] = useState('Principal');

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    if (editId) {
      setAnnouncements(announcements.map(a => a.id === editId ? { ...a, title, content, priority, date: newDate, author: newAuthor } : a));
      setEditId(null);
    } else {
      const newAnn = { id: Date.now(), title, content, priority, date: newDate, author: newAuthor };
      setAnnouncements([newAnn, ...announcements]);
    }
    setTitle('');
    setContent('');
    setPriority('Medium');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewAuthor('Principal');
  };

  const handleEdit = (ann) => {
    setEditId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setPriority(ann.priority);
    setNewDate(ann.date);
    setNewAuthor(ann.author);
  };

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
            <h1>Announcements</h1>
            <p>Create and publish school-wide announcements.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">{editId ? 'Edit Announcement' : 'New Announcement'}</h3>
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea
                className="input-field w-full min-h-[120px]"
                placeholder="Write announcement content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" className="input-field w-full" value={newDate} onChange={e => setNewDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
              <input className="input-field w-full" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} placeholder="Author name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                className="input-field w-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">{editId ? 'Update Announcement' : 'Publish Announcement'}</button>
              {editId && <button type="button" onClick={() => { setEditId(null); setTitle(''); setContent(''); setPriority('Medium'); }} className="btn-outline flex-1">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Published Announcements</h3>
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{ann.title}</h4>
                  <span className={`badge-${ann.priority === 'High' ? 'danger' : ann.priority === 'Medium' ? 'warning' : 'info'} text-xs`}>
                    {ann.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ann.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{ann.author} • {ann.date}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(ann)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => { if (confirm('Delete this announcement?')) setAnnouncements(announcements.filter(a => a.id !== ann.id)); }} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
