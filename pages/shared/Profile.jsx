import React, { useState } from 'react';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: 'Rahul Kumar', email: 'rahul.kumar@school.edu', phone: '+91 98765 43210', bio: 'Class 10 student passionate about science and mathematics.' });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const userRole = 'Student';

  const loginHistory = [
    { device: 'Chrome / Windows', time: 'Today, 10:15 AM', location: 'Mumbai, India' },
    { device: 'Safari / iPhone', time: 'Today, 8:30 AM', location: 'Mumbai, India' },
    { device: 'Chrome / Windows', time: 'Yesterday, 6:45 PM', location: 'Mumbai, India' },
  ];

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="page-header text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              RK
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{form.name}</h2>
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <span className="text-sm text-gray-500 dark:text-gray-400">{userRole}</span>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">🏫 Springdale International School</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">✉️ {form.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">📞 {form.phone}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="sm:ml-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {editing && (
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                <textarea className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none" rows="3" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            </div>
          </div>
        )}

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
          <div className="space-y-3">
            <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" type="password" placeholder="Current password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
            <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" type="password" placeholder="New password" value={pwForm.newPw} onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} />
            <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Update Password</button>
          </div>
        </div>

        {userRole === 'Student' && (
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">👨‍👩‍👧 Parent Linking</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Link your parent/guardian account to keep them updated.</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 text-sm font-semibold">MG</div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Mrs. Gupta (Mother)</p>
                <p className="text-xs text-gray-400">Linked · mrs.gupta@email.com</p>
              </div>
              <span className="ml-auto text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">Linked</span>
            </div>
            <button className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">+ Link another parent</button>
          </div>
        )}

        {userRole === 'Parent' && (
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Linked Children</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 text-sm font-semibold">RK</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Rahul Kumar</p>
                  <p className="text-xs text-gray-400">Class 10-A · Roll No. 25</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Login History</h3>
          <div className="space-y-3">
            {loginHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{h.device}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{h.location}</p>
                </div>
                <span className="text-xs text-gray-400">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-xs text-gray-400">Receive updates via email</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-xs text-gray-400">Receive push notifications</p>
              </div>
              <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Show Online Status</p>
                <p className="text-xs text-gray-400">Let others see when you are online</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
