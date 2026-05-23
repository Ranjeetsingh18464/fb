import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { db, doc, getDoc, setDoc } from '../../services/firebase'
import { setSchoolSettings } from '../../store/slices/themeSlice'

const SETTINGS_ID = 'school_customization'

const themeColors = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0d9488' },
]

export default function Customization() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedColor, setSelectedColor] = useState('#4f46e5')
  const [compactMode, setCompactMode] = useState(false)
  const [sidebarPosition, setSidebarPosition] = useState('left')
  const [logoPreview, setLogoPreview] = useState(null)
  const [schoolName, setSchoolName] = useState('Springfield School')
  const [tagline, setTagline] = useState('Excellence in Education')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', SETTINGS_ID))
        if (snap.exists()) {
          const d = snap.data()
          setSelectedColor(d.themeColor || '#4f46e5')
          setCompactMode(d.compactMode || false)
          setSidebarPosition(d.sidebarPosition || 'left')
          setSchoolName(d.schoolName || 'Springfield School')
          setTagline(d.tagline || 'Excellence in Education')
          if (d.logo) setLogoPreview(d.logo)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (logoPreview && logoPreview.length > 900000) {
        toast.error('Logo is too large. Please use a smaller image.')
        setSaving(false)
        return
      }
      const data = { themeColor: selectedColor, compactMode, sidebarPosition, schoolName, tagline, logo: logoPreview }
      await setDoc(doc(db, 'settings', SETTINGS_ID), data)
      dispatch(setSchoolSettings(data))
      setSaved(true)
      toast.success('Settings saved successfully!')
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const r = new FileReader()
      r.onload = () => setLogoPreview(r.result)
      r.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">← Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Customization</h1>
        </div>

        {saved && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">Settings saved successfully!</div>
        )}

        <div className="flex gap-2 mb-6">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-50 font-medium">{saving ? 'Saving...' : 'Apply & Save'}</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Name</label>
                <input value={schoolName} onChange={e => setSchoolName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
                <input value={tagline} onChange={e => setTagline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500 text-center px-1">No logo</span>
                    )}
                  </div>
                  <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition cursor-pointer">
                    Upload
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Color</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {themeColors.map(c => (
                <button
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-10 h-10 rounded-full transition ${selectedColor === c.value ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Custom:</span>
              <input type="color" value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{selectedColor}</span>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Preview</h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor: selectedColor }}>
                <p className="text-white font-semibold">{schoolName}</p>
                <p className="text-white/80 text-sm">{tagline}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layout Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sidebar Position</label>
                <div className="flex gap-3">
                  <button onClick={() => setSidebarPosition('left')} className={`flex-1 px-4 py-2 rounded-lg border text-sm transition ${sidebarPosition === 'left' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Left</button>
                  <button onClick={() => setSidebarPosition('right')} className={`flex-1 px-4 py-2 rounded-lg border text-sm transition ${sidebarPosition === 'right' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Right</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Compact Mode</span>
                <button onClick={() => setCompactMode(!compactMode)} className={`relative w-11 h-6 rounded-full transition ${compactMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${compactMode ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Configuration</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-500 dark:text-gray-400">Theme Color: <span className="text-gray-900 dark:text-white font-mono">{selectedColor}</span></p>
              <p className="text-gray-500 dark:text-gray-400">School Name: <span className="text-gray-900 dark:text-white">{schoolName}</span></p>
              <p className="text-gray-500 dark:text-gray-400">Sidebar: <span className="text-gray-900 dark:text-white">{sidebarPosition === 'left' ? 'Left' : 'Right'}</span></p>
              <p className="text-gray-500 dark:text-gray-400">Compact Mode: <span className="text-gray-900 dark:text-white">{compactMode ? 'On' : 'Off'}</span></p>
              <p className="text-gray-500 dark:text-gray-400">Logo: <span className="text-gray-900 dark:text-white">{logoPreview ? 'Uploaded' : 'Not set'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
