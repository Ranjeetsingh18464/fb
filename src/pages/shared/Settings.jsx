import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Theme</h3>
            <div className="flex gap-3">
              {["Light", "Dark", "System"].map(t => (
                <button key={t} onClick={() => setTheme(t.toLowerCase())} className={`px-4 py-2 rounded text-sm ${theme === t.toLowerCase() ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { key: "email", label: "Email Notifications" },
                { key: "push", label: "Push Notifications" },
                { key: "sms", label: "SMS Notifications" },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  <input type="checkbox" checked={notifications[item.key]} onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })} className="w-5 h-5" />
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Language</h3>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Info</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Name:</span> John Doe</p>
              <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Email:</span> john.doe@example.com</p>
              <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Role:</span> Student</p>
              <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Member Since:</span> January 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
