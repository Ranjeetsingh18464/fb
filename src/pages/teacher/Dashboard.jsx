import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { db, collection, doc, getDocs, deleteDoc, query, where, orderBy, limit } from "../../services/firebase"

const normalizeGrade = (val) => {
  if (!val) return ""
  const m = String(val).match(/\d+/)
  return m ? m[0] : val.toString().trim()
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [teacherClass, setTeacherClass] = useState(null)
  const [counts, setCounts] = useState({ classes: 0, students: 0, pendingTasks: 0 })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [teacherSnap, classSnap, studentSnap] = await Promise.all([
          getDocs(collection(db, "teachers")),
          getDocs(collection(db, "classes")),
          getDocs(collection(db, "students")),
        ])

        let matchedTeacher = null
        teacherSnap.forEach(d => {
          const t = { id: d.id, ...d.data() }
          if (t.name?.toLowerCase() === "mini" || t.teacherId?.toLowerCase() === "mini") {
            matchedTeacher = t
          }
        })

        const cls = []
        classSnap.forEach(d => cls.push({ id: d.id, ...d.data() }))

        let matchedClass = null
        if (matchedTeacher) {
          matchedClass = cls.find(c => c.teacher === matchedTeacher.name)
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

        setTeacher(matchedTeacher)
        setTeacherClass(matchedClass)

        const teacherGrade = matchedClass ? normalizeGrade(matchedClass.name) : ""
        const teacherSection = matchedClass ? matchedClass.section : ""

        const filteredStudents = []
        studentSnap.forEach(d => {
          const s = { id: d.id, ...d.data() }
          const matchGrade = !teacherGrade || normalizeGrade(s.grade || s.class) === teacherGrade
          const matchSection = !teacherSection || s.section === teacherSection
          if (matchGrade && matchSection) {
            filteredStudents.push(s)
          }
        })

        const [hwSnap, assignSnap, quizSnap, noticeSnap] = await Promise.all([
          getDocs(query(collection(db, "homework"), orderBy("createdAt", "desc"), limit(10))),
          getDocs(query(collection(db, "assignments"), orderBy("createdAt", "desc"), limit(10))),
          getDocs(query(collection(db, "quizzes"), orderBy("createdAt", "desc"), limit(10))),
          getDocs(query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(10))),
        ])

        setCounts({
          classes: matchedClass ? 1 : 0,
          students: filteredStudents.length,
          pendingTasks: hwSnap.size + assignSnap.size,
        })

        const activity = []
        hwSnap.forEach(d => {
          const data = d.data()
          activity.push({ text: "Homework assigned to " + (data.class || "") + " " + (data.section || ""), time: data.dueDate || "", date: data.createdAt, docId: d.id, collection: "homework" })
        })
        assignSnap.forEach(d => {
          const data = d.data()
          activity.push({ text: "Assignment: " + (data.title || ""), time: data.dueDate || "", date: data.createdAt, docId: d.id, collection: "assignments" })
        })
        quizSnap.forEach(d => {
          const data = d.data()
          activity.push({ text: "Quiz published: " + (data.title || ""), time: data.dueDate || "", date: data.createdAt, docId: d.id, collection: "quizzes" })
        })
        noticeSnap.forEach(d => {
          const data = d.data()
          activity.push({ text: "Notice: " + (data.title || ""), time: data.date || "", date: data.createdAt, docId: d.id, collection: "notices" })
        })
        activity.sort((a, b) => {
          const da = a.date && a.date.toDate ? a.date.toDate() : new Date(a.date || 0)
          const db2 = b.date && b.date.toDate ? b.date.toDate() : new Date(b.date || 0)
          return db2 - da
        })
        setActivities(activity.slice(0, 8))
      } catch (err) {
        console.error("Failed to load dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this " + item.collection.slice(0, -1) + "?")) return
    try {
      await deleteDoc(doc(db, item.collection, item.docId))
      toast.success("Deleted")
      window.location.reload()
    } catch (err) {
      console.error("Failed to delete:", err)
      toast.error("Failed to delete")
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
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>

        {teacher && (
          <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Welcome, {teacher.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Teacher ID: {teacher.teacherId || teacher.id}
              {teacherClass ? " | Grade: " + teacherClass.name + " | Section: " + teacherClass.section : ""}
              {teacher.department ? " | Department: " + teacher.department : ""}
            </p>
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{counts.classes}</span>
              </div>
              <button onClick={() => navigate("/dashboard/teacher/timetable")} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View Classes">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Classes Taught</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.classes}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{counts.students}</span>
              </div>
              <button onClick={() => navigate("/dashboard/teacher/attendance")} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View Students">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.students}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{counts.pendingTasks}</span>
              </div>
              <button onClick={() => navigate("/dashboard/teacher/homework")} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View Tasks">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Tasks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.pendingTasks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No recent activity</p>
            ) : activities.map((a, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                <p className="text-gray-700 dark:text-gray-300">{a.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{a.time}</span>
                  {a.docId && (
                    <button onClick={() => handleDelete(a)} className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
