import React, { useState } from 'react';

const notices = [
  { id: 1, title: 'Test on Friday', content: 'There will be a surprise test on Chapter 5 this Friday.', class: '10A', section: 'A', priority: 'High', pinned: true, date: '2026-05-15', author: 'You' },
  { id: 2, title: 'Homework Submission', content: 'Please submit your homework by Wednesday without fail.', class: '10B', section: 'B', priority: 'Medium', pinned: false, date: '2026-05-14', author: 'You' },
  { id: 3, title: 'Class Timetable Change', content: 'Mathematics period on Thursday is moved to 2nd period.', class: '9A', section: 'A', priority: 'Low', pinned: true, date: '2026-05-12', author: 'You' },
  { id: 4, title: 'Bring Geometry Box', content: 'All students must bring geometry box for tomorrow\'s class.', class: '9B', section: 'B', priority: 'Medium', pinned: false, date: '2026-05-10', author: 'You' },
  { id: 5, title: 'Parent Consent Forms', content: 'Submit the consent form for the educational trip by Friday.', class: '10A', section: 'A', priority: 'High', pinned: false, date: '2026-05-08', author: 'You' },
];

export default function ClassNotices() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeClass, setNoticeClass] = useState('');
  const [section, setSection] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [pinned, setPinned] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
  };

  const pinnedNotices = notices.filter((n) => n.pinned);
  const regularNotices = notices.filter((n) => !n.pinned);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Class Notices</h1>
        <p>Create and manage notices for your classes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Create Notice</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" className="input-field w-full" placeholder="Notice title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select className="input-field w-full" value={noticeClass} onChange={(e) => setNoticeClass(e.target.value)}>
                  <option value="">All Classes</option>
                  <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select className="input-field w-full" value={section} onChange={(e) => setSection(e.target.value)}>
                  <option value="">All Sections</option>
                  <option>A</option><option>B</option><option>C</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea className="input-field w-full min-h-[100px]" placeholder="Write notice content..." value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="input-field w-full" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Pin this notice</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Publish Notice</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Notice History</h3>

          {pinnedNotices.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pinned</h4>
              <div className="space-y-3">
                {pinnedNotices.map((notice) => (
                  <div key={notice.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-600 text-xs font-medium">📌</span>
                        <h4 className="font-medium text-sm">{notice.title}</h4>
                      </div>
                      <span className={`badge-${notice.priority === 'High' ? 'danger' : notice.priority === 'Medium' ? 'warning' : 'info'} text-xs`}>
                        {notice.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{notice.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{notice.class || 'All'} • {notice.date}</span>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-yellow-600 hover:underline">Unpin</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Notices</h4>
            <div className="space-y-3">
              {regularNotices.map((notice) => (
                <div key={notice.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{notice.title}</h4>
                    <span className={`badge-${notice.priority === 'High' ? 'danger' : notice.priority === 'Medium' ? 'warning' : 'info'} text-xs`}>
                      {notice.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{notice.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{notice.class || 'All'} • {notice.date}</span>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:underline">Edit</button>
                      <button className="text-yellow-600 hover:underline">Pin</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
