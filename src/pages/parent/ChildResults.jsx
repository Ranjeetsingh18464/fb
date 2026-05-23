import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, getDocs } from "../../services/firebase"

export default function ChildResults() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [examIdx, setExamIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const studentSnap = await getDocs(collection(db, "students"))
        const students = []
        studentSnap.forEach(d => students.push({ id: d.id, ...d.data() }))
        const child = students[0]
        if (!child) { setLoading(false); return }

        const grade = child.grade || "1st Grade"
        const section = child.section || "A"

        const snap = await getDocs(collection(db, "results"))
        const data = []
        snap.forEach(d => {
          const r = { id: d.id, ...d.data() }
          if (r.grade === grade && r.section === section) {
            data.push(r)
          }
        })
        data.sort((a, b) => ((b.date || "") > (a.date || "") ? 1 : -1))
        setExams(data)
      } catch (err) {
        console.error("Failed to load results:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  if (loading) return <div className="p-6 text-center text-gray-400">Loading results...</div>

  if (exams.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Child Results</h1>
          <p className="text-gray-400 dark:text-gray-500 mt-4">No results found.</p>
        </div>
      </div>
    )
  }

  const selected = exams[examIdx] || exams[0]
  const subjects = selected.subjects || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Child Results</h1>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Exam:</label>
          <select value={examIdx} onChange={e => setExamIdx(Number(e.target.value))} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
            {exams.map((e, i) => <option key={i} value={i}>{e.name || "Exam " + (i + 1)}</option>)}
          </select>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Marks</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {subjects.length === 0 ? (
                <tr><td colSpan="4" className="p-6 text-center text-gray-400">No subjects in this exam</td></tr>
              ) : subjects.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-3 text-gray-800 dark:text-white">{s.name}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{s.marks}</td>
                  <td className="p-3 text-gray-500">{s.total}</td>
                  <td className="p-3"><span className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">{s.grade || "—"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
