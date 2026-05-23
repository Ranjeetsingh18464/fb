import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, getDocs } from "../../services/firebase"

export default function Teachers() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "teachers"))
        const list = []
        snap.forEach(d => list.push({ id: d.id, ...d.data() }))
        setTeachers(list)
      } catch (err) {
        console.error("Failed to load teachers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Teachers Directory</h1>

        {teachers.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No teachers found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <div key={t.id} onClick={() => setSelected(t)} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 cursor-pointer hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{t.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.department}{t.subject ? " · " + t.subject : ""}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{Array.isArray(t.classes) ? t.classes.join(", ") : t.classes || ""}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">{t.email || t.contact || ""}</p>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelected(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selected.name}</h2>
              <div className="space-y-3 text-sm">
                {selected.department && <div><span className="font-medium text-gray-600 dark:text-gray-400">Department:</span> <span className="text-gray-900 dark:text-white">{selected.department}</span></div>}
                {selected.subject && <div><span className="font-medium text-gray-600 dark:text-gray-400">Subject:</span> <span className="text-gray-900 dark:text-white">{selected.subject}</span></div>}
                {selected.classes && <div><span className="font-medium text-gray-600 dark:text-gray-400">Classes:</span> <span className="text-gray-900 dark:text-white">{Array.isArray(selected.classes) ? selected.classes.join(", ") : selected.classes}</span></div>}
                {selected.teacherId && <div><span className="font-medium text-gray-600 dark:text-gray-400">Teacher ID:</span> <span className="text-gray-900 dark:text-white">{selected.teacherId}</span></div>}
                <div><span className="font-medium text-gray-600 dark:text-gray-400">Email:</span> <span className="text-gray-900 dark:text-white">{selected.email || selected.contact}</span></div>
                {selected.phone && <div><span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-white">{selected.phone}</span></div>}
              </div>
              <button onClick={() => setSelected(null)} className="mt-6 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
