import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, getDocs } from "../../services/firebase"

export default function Analytics() {
  const navigate = useNavigate()
  const [data, setData] = useState({ avgMarks: null, attendance: null, studentCount: 0, classCount: 0, subjects: [], trend: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentSnap, classSnap, resultSnap, attSnap] = await Promise.all([
          getDocs(collection(db, "students")),
          getDocs(collection(db, "classes")),
          getDocs(collection(db, "results")),
          getDocs(collection(db, "attendance")),
        ])

        const sc = studentSnap.size
        const cc = classSnap.size

        let totalMarks = 0
        let totalPossible = 0
        const subjectScores = {}
        const examGroups = {}

        resultSnap.forEach(d => {
          const r = d.data()
          const subjects = r.subjects || []
          const examName = r.name || r.examName || ""
          const date = r.date || ""

          if (!examGroups[examName]) examGroups[examName] = { marks: 0, possible: 0 }
          subjects.forEach(s => {
            const m = Number(s.marks) || 0
            const t = Number(s.total) || 0
            totalMarks += m
            totalPossible += t

            if (!subjectScores[s.name]) subjectScores[s.name] = { total: 0, count: 0 }
            subjectScores[s.name].total += m / (t || 1) * 100
            subjectScores[s.name].count++

            if (examGroups[examName]) {
              examGroups[examName].marks += m
              examGroups[examName].possible += t
              if (!examGroups[examName].date) examGroups[examName].date = date
            }
          })
        })

        const avgMarks = totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(1) : null

        const subjects = Object.entries(subjectScores).map(([name, val]) => ({
          name,
          avg: Math.round(val.total / val.count),
          color: ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-teal-500", "bg-pink-500"][Math.floor(Math.random() * 6)],
        }))

        const trend = Object.entries(examGroups)
          .filter(([k]) => k)
          .sort((a, b) => (a[1].date || "").localeCompare(b[1].date || ""))
          .slice(-6)
          .map(([name, val]) => ({
            label: name.substring(0, 12),
            value: val.possible > 0 ? Math.round((val.marks / val.possible) * 100) : 0,
          }))

        let present = 0, total = 0
        attSnap.forEach(d => {
          const s = d.data().status
          total++
          if (s === "present" || s === "Present") present++
        })
        const attendance = total > 0 ? ((present / total) * 100).toFixed(1) : null

        setData({ avgMarks, attendance, studentCount: sc, classCount: cc, subjects, trend })
      } catch (err) {
        console.error("Failed to load analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">School Analytics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Marks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{data.avgMarks !== null ? data.avgMarks + "%" : "—"}</p>
            <span className="text-xs text-green-500">Across all exams</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{data.attendance !== null ? data.attendance + "%" : "—"}</p>
            <span className="text-xs text-green-500">Overall average</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{data.studentCount}</p>
            <span className="text-xs text-blue-500">Across {data.classCount} classes</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Performance</h2>
          {data.subjects.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No exam results available</p>
          ) : (
            <div className="space-y-4">
              {data.subjects.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{s.avg}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={"h-full rounded-full " + s.color + " transition-all duration-500"} style={{ width: s.avg + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trend (Last 6 Terms)</h2>
          {data.trend.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No exam data for trend</p>
          ) : (
            <div className="h-48 flex items-end justify-center gap-3">
              {data.trend.map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.value}%</span>
                  <div className="w-10 bg-blue-500 rounded-t" style={{ height: (t.value * 1.5) + "px" }} />
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
