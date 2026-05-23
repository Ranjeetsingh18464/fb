import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, getDocs } from "../../services/firebase"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export default function ChildAttendance() {
  const navigate = useNavigate()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year] = useState(now.getFullYear())
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true)
      try {
        const studentSnap = await getDocs(collection(db, "students"))
        const students = []
        studentSnap.forEach(d => students.push({ id: d.id, ...d.data() }))
        const child = students[0]
        if (!child) { setLoading(false); return }

        const grade = child.grade || "1st Grade"
        const section = child.section || "A"

        const snap = await getDocs(collection(db, "attendance"))
        const map = {}
        snap.forEach(d => {
          const data = d.data()
          if (data.grade === grade && data.section === section) {
            if (data.date) {
              const dDate = new Date(data.date + "T00:00:00")
              if (dDate.getMonth() === month && dDate.getFullYear() === year) {
                const day = dDate.getDate()
                map[day] = data.status
              }
            }
          }
        })
        setAttendance(map)
      } catch (err) {
        console.error("Failed to load attendance:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [month, year])

  const daysInMonth = getDaysInMonth(year, month)
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    const status = attendance[dayNum]
    return { date: dayNum, status: status || "—" }
  })

  const present = days.filter(d => d.status === "present" || d.status === "Present").length
  const pct = daysInMonth > 0 ? Math.round((present / daysInMonth) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Child Attendance</h1>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Month:</label>
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading attendance...</div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Attendance Percentage</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full text-xs text-white text-center leading-4" style={{ width: pct + "%" }}>{pct}%</div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{present} / {daysInMonth} days present</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Daily Record</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {days.map(d => (
                  <div key={d.date} className={"text-center p-2 rounded text-sm " + (d.status === "Present" || d.status === "present" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : d.status === "Absent" || d.status === "absent" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" : d.status === "Late" || d.status === "late" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500")}>
                    <div className="font-semibold">{d.date}</div>
                    <div className="text-xs">{d.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
