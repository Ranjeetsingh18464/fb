import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, getDocs, query, where } from "../../services/firebase"

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState({ pct: null, fees: null, grade: null, notices: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentSnap = await getDocs(collection(db, "students"))
        const students = []
        studentSnap.forEach(d => students.push({ id: d.id, ...d.data() }))
        const child = students[0]
        if (!child) { setLoading(false); return }

        const grade = child.grade || "1st Grade"
        const section = child.section || "A"
        const today = new Date()
        const month = today.getMonth() + 1
        const year = today.getFullYear()

        const [attSnap, resultSnap, noticeSnap, feeSnap] = await Promise.all([
          getDocs(query(collection(db, "attendance"), where("grade", "==", grade), where("section", "==", section), where("month", "==", month), where("year", "==", year))),
          getDocs(query(collection(db, "results"), where("grade", "==", grade), where("section", "==", section))),
          getDocs(query(collection(db, "notices"), where("class", "==", grade), where("section", "==", section))),
          getDocs(collection(db, "feeRecords")),
        ])

        let present = 0
        let total = 0
        attSnap.forEach(d => { total++; if (d.data().status === "present" || d.data().status === "Present") present++ })
        const pct = total > 0 ? Math.round((present / total) * 100) : null

        let latestResult = null
        let latestDate = ""
        resultSnap.forEach(d => {
          const r = d.data()
          if (r.date && r.date > latestDate) { latestDate = r.date; latestResult = r }
        })
        let gradeLetter = null
        if (latestResult && latestResult.subjects) {
          const totalMarks = latestResult.subjects.reduce((a, s) => a + (s.marks || 0), 0)
          const totalPossible = latestResult.subjects.reduce((a, s) => a + (s.total || 0), 0)
          const p = totalPossible ? ((totalMarks / totalPossible) * 100) : 0
          gradeLetter = p >= 90 ? "A" : p >= 80 ? "B" : p >= 70 ? "C" : p >= 60 ? "D" : "F"
        }

        const nt = []
        noticeSnap.forEach(d => nt.push({ id: d.id, ...d.data() }))

        let feePending = "0"
        feeSnap.forEach(d => {
          const r = d.data()
          if (r.studentId === child.id) {
            feePending = String(Number(r.pendingAmount) || 0)
          }
        })

        setData({ pct, fees: feePending, grade: gradeLetter, notices: nt.slice(0, 5), childName: child.name })
      } catch (err) {
        console.error("Failed to load dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="p-6 text-center text-gray-400">Loading dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Parent Dashboard</h1>
        {data.childName && <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6">Child: {data.childName}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Child's Attendance</h2>
            <p className={"text-3xl font-bold mt-2 " + (data.pct !== null ? "text-green-600 dark:text-green-400" : "text-gray-400")}>{data.pct !== null ? data.pct + "%" : "—"}</p>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Fees</h2>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{data.fees || "—"}</p>
            <p className="text-xs text-gray-400 mt-1">Pending</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Results</h2>
            <p className={"text-3xl font-bold mt-2 " + (data.grade ? "text-blue-600 dark:text-blue-400" : "text-gray-400")}>{data.grade || "—"}</p>
            <p className="text-xs text-gray-400 mt-1">Last exam</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notices</h2>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{data.notices.length}</p>
            <p className="text-xs text-gray-400 mt-1">Active</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Notices</h3>
            {data.notices.length === 0 ? (
              <p className="text-sm text-gray-400">No notices.</p>
            ) : (
              <ul className="space-y-3">
                {data.notices.map((n, i) => (
                  <li key={n.id || i} className="border-b dark:border-gray-700 pb-2">
                    <p className="font-medium text-gray-800 dark:text-white">{n.title}</p>
                    <p className="text-sm text-gray-500">{n.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate("/dashboard/parent/child-attendance")} className="p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm font-medium hover:bg-blue-100">Attendance</button>
              <button onClick={() => navigate("/dashboard/parent/child-results")} className="p-3 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm font-medium hover:bg-green-100">Results</button>
              <button onClick={() => navigate("/dashboard/parent/fees")} className="p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm font-medium hover:bg-red-100">Fees</button>
              <button onClick={() => navigate("/dashboard/parent/notices")} className="p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-sm font-medium hover:bg-yellow-100">Notices</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
