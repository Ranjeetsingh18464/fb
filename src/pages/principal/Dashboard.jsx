import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { db, collection, doc, getDocs, deleteDoc } from '../../services/firebase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ teachers: 0, classes: 0, students: 0, events: 0 })
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [teacherSnap, classSnap, studentSnap, eventSnap, announceSnap] = await Promise.all([
        getDocs(collection(db, 'teachers')),
        getDocs(collection(db, 'classes')),
        getDocs(collection(db, 'students')),
        getDocs(collection(db, 'events')),
        getDocs(collection(db, 'announcements'))
      ])

      setCounts({
        teachers: teacherSnap.size,
        classes: classSnap.size,
        students: studentSnap.size,
        events: eventSnap.size,
      })

      const list = []
      announceSnap.forEach(d => list.push({ id: d.id, ...d.data() }))
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      setAnnouncements(list.slice(0, 10))
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    try {
      await deleteDoc(doc(db, 'announcements', id))
      toast.success('Announcement deleted')
      fetchData()
    } catch (err) {
      console.error('Failed to delete announcement:', err)
      toast.error('Failed to delete')
    }
  }

  const icons = {
    teachers: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    classes: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    students: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
    events: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  }
  const stats = [
    { label: 'Total Teachers', value: String(counts.teachers), icon: icons.teachers, color: 'bg-blue-500', path: '/dashboard/principal/teachers' },
    { label: 'Classes', value: String(counts.classes), icon: icons.classes, color: 'bg-green-500', path: '/dashboard/principal/classes' },
    { label: 'Students', value: String(counts.students), icon: icons.students, color: 'bg-purple-500', path: '/dashboard/principal/students' },
    { label: 'Events', value: String(counts.events), icon: icons.events, color: 'bg-orange-500', path: '/dashboard/principal/events' },
  ]

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
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Principal Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                  {s.icon}
                </div>
                <button
                  onClick={() => navigate(s.path)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  title={`View ${s.label}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Announcements
          </h2>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No announcements yet</p>
            ) : announcements.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Audience: {a.targetClass || 'All'} &middot; {a.targetSection || 'All'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{a.date || ''}</span>
                  <button
                    onClick={() => handleDeleteAnnouncement(a.id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
