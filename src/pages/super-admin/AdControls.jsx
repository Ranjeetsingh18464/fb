import { useState } from 'react'

const initialSlots = [
  { id: 1, name: 'Homepage Banner', placement: 'Top', enabled: true, frequency: 3 },
  { id: 2, name: 'Sidebar Ad', placement: 'Right Sidebar', enabled: true, frequency: 5 },
  { id: 3, name: 'Dashboard Footer', placement: 'Bottom', enabled: false, frequency: 2 },
  { id: 4, name: 'Mobile Interstitial', placement: 'Full Screen', enabled: true, frequency: 1 },
  { id: 5, name: 'Email Newsletter', placement: 'Inline', enabled: false, frequency: 4 },
  { id: 6, name: 'Search Results', placement: 'Between Results', enabled: true, frequency: 3 },
]

export default function AdControls() {
  const [slots, setSlots] = useState(initialSlots)

  const toggleSlot = (id) => {
    setSlots(slots.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  const updateFrequency = (id, val) => {
    const freq = Math.max(1, Math.min(10, Number(val)))
    setSlots(slots.map((s) => (s.id === id ? { ...s, frequency: freq } : s)))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Ad Controls</h1>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Ad Slot</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Placement</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Enabled</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Frequency (per session)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{slot.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{slot.placement}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSlot(slot.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          slot.enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            slot.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={slot.frequency}
                          onChange={(e) => updateFrequency(slot.id, e.target.value)}
                          className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <span className="text-xs text-gray-400 dark:text-gray-500">times</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Frequency Controls</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Frequency controls how many times an ad slot can be shown to a single user per session. Values range from 1 to 10. Disabled slots will not serve any ads regardless of frequency settings.
          </p>
        </div>
      </div>
    </div>
  )
}
