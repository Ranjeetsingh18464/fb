import React, { useState } from 'react';

const myGroups = [
  { id: 1, name: 'Math Olympiad Team', members: 24, type: 'Academic', posts: 12, lastActive: '2 hours ago' },
  { id: 2, name: 'Doubt Solving Group', members: 42, type: 'Educational', posts: 8, lastActive: '1 day ago' },
  { id: 3, name: 'Project Collaboration', members: 15, type: 'Project', posts: 5, lastActive: '3 days ago' },
  { id: 4, name: 'Class 10A Study Group', members: 38, type: 'Class', posts: 20, lastActive: '5 hours ago' },
];

const groupMembers = [
  { id: 1, name: 'Aarav Sharma', role: 'Member', joined: '2026-04-10' },
  { id: 2, name: 'Bhavya Patel', role: 'Member', joined: '2026-04-10' },
  { id: 3, name: 'Chirag Singh', role: 'Moderator', joined: '2026-04-05' },
  { id: 4, name: 'Divya Verma', role: 'Member', joined: '2026-04-12' },
  { id: 5, name: 'Ekta Joshi', role: 'Member', joined: '2026-04-10' },
];

const groupPosts = [
  { id: 1, author: 'Chirag Singh', content: 'Can someone explain the Pythagorean theorem proof?', time: '1 hour ago', replies: 5 },
  { id: 2, author: 'Divya Verma', content: 'Here are some practice problems for the upcoming test.', time: '3 hours ago', replies: 3 },
  { id: 3, author: 'Aarav Sharma', content: 'Thank you for the notes on quadratic equations!', time: '5 hours ago', replies: 2 },
];

export default function Groups() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tab, setTab] = useState('members');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Educational Groups</h1>
        <p>Create and manage student groups for collaborative learning.</p>
      </div>

      <div className="flex justify-end mb-6">
        <button className="btn-primary">+ Create Group</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card">
          <h3 className="font-semibold text-lg mb-4">My Groups</h3>
          <div className="space-y-3">
            {myGroups.map((g) => (
              <div
                key={g.id}
                className={`border rounded-lg p-3 cursor-pointer transition ${selectedGroup === g.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => { setSelectedGroup(g.id); setTab('members'); }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{g.name}</p>
                  <span className="badge-info text-xs">{g.type}</span>
                </div>
                <p className="text-xs text-gray-500">{g.members} members • {g.posts} posts</p>
                <p className="text-xs text-gray-400 mt-1">Active {g.lastActive}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card">
          {selectedGroup ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{myGroups.find((g) => g.id === selectedGroup)?.name}</h3>
                <div className="flex gap-2">
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === 'members' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setTab('members')}>Members</button>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setTab('posts')}>Posts</button>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setTab('settings')}>Settings</button>
                </div>
              </div>

              {tab === 'members' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-sm">#</th>
                        <th className="py-3 px-4 font-semibold text-sm">Name</th>
                        <th className="py-3 px-4 font-semibold text-sm">Role</th>
                        <th className="py-3 px-4 font-semibold text-sm">Joined</th>
                        <th className="py-3 px-4 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupMembers.map((m, idx) => (
                        <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{idx + 1}</td>
                          <td className="py-3 px-4 font-medium">{m.name}</td>
                          <td className="py-3 px-4">
                            <span className={`badge-${m.role === 'Moderator' ? 'warning' : 'info'} text-xs`}>{m.role}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{m.joined}</td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:underline text-xs mr-2">Promote</button>
                            <button className="text-red-600 hover:underline text-xs">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'posts' && (
                <div className="space-y-4">
                  {groupPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{post.author}</p>
                        <span className="text-xs text-gray-400">{post.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{post.replies} replies</span>
                        <button className="text-blue-600 hover:underline">Reply</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                        <button className="text-yellow-600 hover:underline">Pin</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'settings' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                    <input type="text" className="input-field w-full" defaultValue={myGroups.find((g) => g.id === selectedGroup)?.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea className="input-field w-full min-h-[80px]" placeholder="Group description" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                    <select className="input-field w-full">
                      <option>Academic</option>
                      <option>Educational</option>
                      <option>Project</option>
                      <option>Class</option>
                    </select>
                  </div>
                  <button className="btn-primary">Update Group</button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Select a group to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
