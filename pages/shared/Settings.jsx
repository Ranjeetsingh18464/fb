import React, { useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('System');
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: true, sms: false });
  const [language, setLanguage] = useState('English');
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="page-header text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🎨 Theme</h3>
          <div className="flex gap-3">
            {['Light', 'Dark', 'System'].map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t === 'Light' ? '☀️' : t === 'Dark' ? '🌙' : '💻'} {t}
              </button>
            ))}
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🔔 Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifPrefs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    notifPrefs[item.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    notifPrefs[item.key] ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🔒 Privacy Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Profile Visibility</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Who can see your profile</p>
              </div>
              <select className="input-field p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Everyone</option>
                <option>Only School</option>
                <option>Only Teachers</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Show Online Status</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Let others see when you are active</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Activity Log</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Allow logging your activities</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🌐 Language</h3>
          <select
            className="input-field w-full sm:w-64 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">⚙️ Account Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Deactivate Account</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Temporarily disable your account</p>
              </div>
              <button
                onClick={() => setShowDeactivate(!showDeactivate)}
                className="px-3 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Deactivate
              </button>
            </div>
            {showDeactivate && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
                Are you sure? Your account will be hidden until you reactivate.
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded text-xs">Confirm</button>
                  <button onClick={() => setShowDeactivate(false)} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">Cancel</button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Delete Account</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Permanently remove your account and data</p>
              </div>
              <button
                onClick={() => setShowDelete(!showDelete)}
                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
            {showDelete && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
                This action is irreversible. All your data will be permanently deleted.
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-xs">Confirm Delete</button>
                  <button onClick={() => setShowDelete(false)} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">ℹ️ App Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">App Version</span>
              <span className="text-gray-900 dark:text-white">v2.4.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Build</span>
              <span className="text-gray-900 dark:text-white">2025.03.15-1200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Platform</span>
              <span className="text-gray-900 dark:text-white">Web / PWA</span>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🆘 Help & Support</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
              📖 FAQ & User Guide
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
              💬 Contact Support
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
              🐛 Report a Bug
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
              💡 Suggest a Feature
            </button>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📜 Legal</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <button className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</button>
            <button className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</button>
            <button className="text-blue-600 dark:text-blue-400 hover:underline">Cookie Policy</button>
            <button className="text-blue-600 dark:text-blue-400 hover:underline">Data Processing Agreement</button>
          </div>
        </div>
      </div>
    </div>
  );
}
