import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, getDocs } from '../../services/firebase'

export default function Parents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'students'))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setStudents(list)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(s => {
    if (filterName && !s.name.toLowerCase().includes(filterName.toLowerCase()) && !(s.parent || '').toLowerCase().includes(filterName.toLowerCase())) return false
    return true
  })

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Parents</h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <input value={filterName} onChange={e => setFilterName(e.target.value)} placeholder="Search by student or parent name..." className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 flex-1 min-w-[200px]" />
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Student Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Father's Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Father's Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Address</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.parent || '—'}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.parentPhone || s.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.address || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setViewing(s)} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setViewing(null)}>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{viewing.name}</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Father's Name: <span className="text-gray-900 dark:text-white">{viewing.parent || '—'}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Father's Phone: <span className="text-gray-900 dark:text-white">{viewing.parentPhone || viewing.phone || '—'}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Grade: <span className="text-gray-900 dark:text-white">{viewing.grade} - {viewing.section}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Student Phone: <span className="text-gray-900 dark:text-white">{viewing.phone || '—'}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Address: <span className="text-gray-900 dark:text-white">{viewing.address || '—'}</span></p>
              </div>
              <button onClick={() => setViewing(null)} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
