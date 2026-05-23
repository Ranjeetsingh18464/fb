import { useState } from 'react'

const initialSettings = {
  maintenanceMode: false,
  openRegistration: true,
  analyticsTracking: true,
  emailNotifications: true,
  smsNotifications: false,
  autoBackup: true,
  publicApi: false,
  debugMode: false,
}

export default function System() {
  const [settings, setSettings] = useState(initialSettings)
  const [saved, setSaved] = useState(false)

  const toggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>

        {saved && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
            Settings saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* General */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General</h2>
            <div className="space-y-4">
              {[
                { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put the platform in maintenance mode. Only admins can access.' },
                { key: 'openRegistration', label: 'Open Registration', desc: 'Allow new users to register without an invite.' },
                { key: 'publicApi', label: 'Public API', desc: 'Enable public API access for third-party integrations.' },
                { key: 'debugMode', label: 'Debug Mode', desc: 'Enable verbose logging for debugging purposes.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition flex-shrink-0 ${
                      settings[item.key] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email alerts for system events.' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send SMS alerts for critical events.' },
                { key: 'analyticsTracking', label: 'Analytics Tracking', desc: 'Collect anonymous usage analytics.' },
                { key: 'autoBackup', label: 'Automatic Backup', desc: 'Schedule daily automated database backups.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition flex-shrink-0 ${
                      settings[item.key] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
