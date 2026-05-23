import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const defaults = {
  schoolName: 'Springfield High School',
  tagline: 'Empowering Future Leaders',
  primaryColor: '#6366f1',
  theme: 'system',
  showAds: true,
  logoPreview: null,
  faviconPreview: null
}

export default function Customization() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({ ...defaults })

  const handleFile = (e, key) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setSettings({ ...settings, [key]: ev.target.result })
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/school_admin')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="page-title">Customization</h1>
            <p className="page-subtitle">Brand your school app with custom settings</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => alert('Changes saved successfully!')} className="btn-primary">💾 Save Changes</button>
        <button onClick={() => alert('Changes discarded.')} className="btn-outline">Discard</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Name</label>
                <input type="text" className="input-field" value={settings.schoolName} onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
                <input type="text" className="input-field" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Branding Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Logo</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                  {settings.logoPreview ? (
                    <div className="mb-3">
                      <img src={settings.logoPreview} alt="Logo preview" className="w-24 h-24 object-contain mx-auto rounded-lg" />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto text-3xl text-gray-400">🏫</div>
                    </div>
                  )}
                  <label className="btn-ghost text-sm cursor-pointer inline-flex items-center gap-1">
                    📁 Upload Logo
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'logoPreview')} />
                  </label>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG or SVG. Max 2MB.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Favicon</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                  {settings.faviconPreview ? (
                    <div className="mb-3">
                      <img src={settings.faviconPreview} alt="Favicon preview" className="w-12 h-12 object-contain mx-auto rounded-lg" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3 text-xl text-gray-400">🔖</div>
                  )}
                  <label className="btn-ghost text-sm cursor-pointer inline-flex items-center gap-1">
                    📁 Upload Favicon
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'faviconPreview')} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Theme Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{settings.primaryColor}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {['#6366f1', '#3b82f6', '#22c55e', '#f97316', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                    <button key={c} className={`w-7 h-7 rounded-full border-2 ${settings.primaryColor === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} onClick={() => setSettings({ ...settings, primaryColor: c })}></button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Scheme</label>
                <div className="space-y-2">
                  {[
                    { value: 'light', label: 'Light Mode', icon: '☀️' },
                    { value: 'dark', label: 'Dark Mode', icon: '🌙' },
                    { value: 'system', label: 'System Default', icon: '💻' }
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${settings.theme === opt.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      <input type="radio" name="theme" className="accent-primary-600" checked={settings.theme === opt.value} onChange={() => setSettings({ ...settings, theme: opt.value })} />
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Advertisement</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Show Ads</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Display advertisements in the app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.showAds} onChange={(e) => setSettings({ ...settings, showAds: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            {settings.showAds && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                <p>Ad space will be shown on the dashboard and student pages.</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Preview</h3>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4" style={{ backgroundColor: settings.primaryColor }}>
                <div className="flex items-center gap-3 text-white">
                  {settings.logoPreview ? (
                    <img src={settings.logoPreview} alt="" className="w-10 h-10 rounded-lg object-contain bg-white" />
                  ) : (
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg">🏫</div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{settings.schoolName}</p>
                    <p className="text-xs text-white/70">{settings.tagline}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <p className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Sample Card</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">This is how your students will see the app with the current branding settings.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Danger Zone</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Reset all customization to default values.</p>
            <button onClick={() => { if (confirm('Reset all settings to defaults?')) setSettings({ ...defaults }) }} className="w-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-100 transition-colors">Reset to Defaults</button>
          </div>
        </div>
      </div>
    </div>
  )
}
