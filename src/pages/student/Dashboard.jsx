import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { db, collection, getDocs, query, where } from "../../services/firebase"

export default function Dashboard() {
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [homeworks, setHomeworks] = useState([])
  const [notices, setNotices] = useState([])
  const [attendancePct, setAttendancePct] = useState(null)
  const [resultSummary, setResultSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const grade = userProfile?.grade || "1st Grade"
  const section = userProfile?.section || "A"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date()
        const month = today.getMonth() + 1
        const year = today.getFullYear()

        const [hwSnap, noticeSnap, attSnap, resultSnap] = await Promise.all([
          getDocs(query(collection(db, "homework"), where("class", "==", grade), where("section", "==", section))),
          getDocs(query(collection(db, "notices"), where("class", "==", grade), where("section", "==", section))),
          getDocs(query(collection(db, "attendance"), where("grade", "==", grade), where("section", "==", section), where("month", "==", month), where("year", "==", year))),
          getDocs(query(collection(db, "results"), where("grade", "==", grade), where("section", "==", section))),
        ])

        const hw = []
        hwSnap.forEach(doc => hw.push({ id: doc.id, ...doc.data() }))
        setHomeworks(hw)

        const nt = []
        noticeSnap.forEach(doc => nt.push({ id: doc.id, ...doc.data() }))
        setNotices(nt)

        let present = 0
        let total = 0
        attSnap.forEach(doc => {
          total++
          if (doc.data().status === "present" || doc.data().status === "Present") present++
        })
        setAttendancePct(total > 0 ? Math.round((present / total) * 100) : null)

        let latestResult = null
        let latestDate = ""
        resultSnap.forEach(doc => {
          const d = doc.data()
          if (d.date && d.date > latestDate) {
            latestDate = d.date
            latestResult = d
          }
        })
        if (latestResult && latestResult.subjects) {
          const totalMarks = latestResult.subjects.reduce((a, s) => a + (s.marks || 0), 0)
          const totalPossible = latestResult.subjects.reduce((a, s) => a + (s.total || 0), 0)
          const pct = totalPossible ? ((totalMarks / totalPossible) * 100).toFixed(1) : "0"
          setResultSummary(pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F")
        } else if (latestResult) {
          setResultSummary("A")
        } else {
          setResultSummary(null)
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [grade, section])

  const upcoming = homeworks.filter(h => h.status !== "Submitted").slice(0, 3)

  if (loading) return <div className="p-6 text-center text-gray-400">Loading dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Student Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{grade} | Section {section}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Homework</h2>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{upcoming.length}</p>
            <p className="text-xs text-gray-400 mt-1">Pending submissions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance</h2>
            <p className={"text-3xl font-bold mt-2 " + (attendancePct !== null ? "text-green-600 dark:text-green-400" : "text-gray-400")}>{attendancePct !== null ? attendancePct + "%" : "—"}</p>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Results</h2>
            <p className={"text-3xl font-bold mt-2 " + (resultSummary ? "text-blue-600 dark:text-blue-400" : "text-gray-400")}>{resultSummary || "—"}</p>
            <p className="text-xs text-gray-400 mt-1">Last exam</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notices</h2>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{notices.length}</p>
            <p className="text-xs text-gray-400 mt-1">Active</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Upcoming Homework</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400">No pending homework.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map(h => (
                  <li key={h.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                    <div><p className="font-medium text-gray-800 dark:text-white">{h.subject}</p><p className="text-sm text-gray-500">{h.title}</p></div>
                    <span className="text-xs text-gray-400">Due: {h.dueDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Notices</h3>
            {notices.length === 0 ? (
              <p className="text-sm text-gray-400">No notices.</p>
            ) : (
              <ul className="space-y-3">
                {notices.slice(0, 5).map(n => (
                  <li key={n.id} className="border-b dark:border-gray-700 pb-2">
                    <p className="font-medium text-gray-800 dark:text-white">{n.title}</p>
                    <p className="text-sm text-gray-500">{n.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
