import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, doc, getDocs, setDoc, query, where } from "../../services/firebase"

const normalizeGrade = (val) => {
  if (!val) return ""
  const m = String(val).match(/\d+/)
  return m ? m[0] : val.toString().trim()
}

export default function Attendance() {
  const navigate = useNavigate()
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [teacherClass, setTeacherClass] = useState(null)

  const fmtDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (students.length > 0) fetchAttendance()
  }, [date, students])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [studentSnap, classSnap, teacherSnap] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "classes")),
        getDocs(collection(db, "teachers"))
      ])
      const cls = []
      classSnap.forEach(d => cls.push({ id: d.id, ...d.data() }))

      let matchedClass = null
      const teachersList = []
      teacherSnap.forEach(d => teachersList.push({ id: d.id, ...d.data() }))

      const teacher = teachersList.find(t => t.name?.toLowerCase() === "mini" || t.teacherId?.toLowerCase() === "mini" || t.id?.toLowerCase() === "mini")
      if (teacher) {
        matchedClass = cls.find(c => c.teacher === teacher.name)
      }
      if (!matchedClass) {
        matchedClass = cls.find(c => normalizeGrade(c.name) === "1" && c.section === "A")
      }
      if (!matchedClass) {
        matchedClass = cls.find(c => normalizeGrade(c.name) === "1")
      }
      if (!matchedClass) {
        matchedClass = cls[0] || null
      }
      setTeacherClass(matchedClass)

      const list = []
      studentSnap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setStudents(list)
    } catch (err) {
      console.error("Failed to load data:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    try {
      const q = query(collection(db, "attendance"), where("date", "==", date))
      const snap = await getDocs(q)
      const map = {}
      snap.forEach(d => { map[d.data().studentId] = d.data().status })
      setAttendance(map)
    } catch (err) {
      console.error("Failed to load attendance:", err)
    }
  }

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: prev[studentId] === status ? "" : status }))
  }

  const saveAttendance = async () => {
    setSaving(true)
    try {
      for (const student of students) {
        const status = attendance[student.id]
        if (status) {
          await setDoc(doc(db, "attendance", `${date}_${student.id}`), {
            studentId: student.id,
            studentName: student.name,
            grade: student.grade,
            section: student.section,
            date,
            status
          })
        }
      }
    } catch (err) {
      console.error("Failed to save attendance:", err)
    } finally {
      setSaving(false)
    }
  }

  const teacherGrade = teacherClass ? normalizeGrade(teacherClass.name) : ""
  const teacherSection = teacherClass ? teacherClass.section : ""

  const filteredStudents = students.filter(s => {
    const matchGrade = !teacherGrade || normalizeGrade(s.grade || s.class) === teacherGrade
    const matchSection = !teacherSection || s.section === teacherSection
    return matchGrade && matchSection
  })

  const counts = { present: 0, absent: 0, late: 0 }
  filteredStudents.forEach(s => {
    const st = attendance[s.id]
    if (st === "present") counts.present++
    else if (st === "absent") counts.absent++
    else if (st === "late") counts.late++
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:shadow-md transition-all">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mark Attendance - {fmtDate}</h1>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
          {teacherClass && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Class {teacherClass.name} - Section {teacherClass.section}
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-3 flex items-center gap-2">
            <span className="text-lg">&#10003;</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Present <strong className="text-gray-900 dark:text-white">{counts.present}</strong></span>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3 flex items-center gap-2">
            <span className="text-lg">&#10007;</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Absent <strong className="text-gray-900 dark:text-white">{counts.absent}</strong></span>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-4 py-3 flex items-center gap-2">
            <span className="text-lg">&#9201;</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Late <strong className="text-gray-900 dark:text-white">{counts.late}</strong></span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{teacherClass ? "No students found for your class." : "No students found."}</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            {filteredStudents.map(s => {
              const st = attendance[s.id] || ""
              return (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                    {s.name ? s.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">ID: {s.studentId || s.id}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {["present", "absent", "late"].map(opt => (
                      <button key={opt} onClick={() => setStatus(s.id, opt)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                          st === opt
                            ? opt === "present" ? "bg-green-500 text-white"
                              : opt === "absent" ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {opt === "present" ? "P" : opt === "absent" ? "A" : "L"}
                      </button>
                    ))}
                    <button
                      onClick={() => window.location.href = `mailto:${s.email || ''}`}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-sm transition-colors"
                      title={`Email ${s.name}`}
                    >&#9993;</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filteredStudents.length > 0 && (
          <button onClick={saveAttendance} disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-50 font-medium">
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        )}
      </div>
    </div>
  )
}