import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from '../../services/firebase'

const departments = ['-- Select Department --', 'Science', 'Arts', 'Commerce', 'Languages', 'Mathematics', 'Physical Education', 'Computer Science']
const grades = ['-- Select Grade --', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const sections = ['-- Select Section --', 'A', 'B', 'C', 'D', 'E']

export default function Teachers() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [filterClass, setFilterClass] = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [filterName, setFilterName] = useState('')

  const matchedClass = (t) => classes.find(c => c.teacher === t.name)
  const getGrade = (t) => { const m = matchedClass(t); return m ? m.name : t.grade }
  const getSection = (t) => { const m = matchedClass(t); return m ? m.section : t.section }

  const filteredTeachers = teachers.filter(t => {
    if (filterClass && getGrade(t) !== filterClass) return false
    if (filterSection && getSection(t) !== filterSection) return false
    if (filterName && !t.name.toLowerCase().includes(filterName.toLowerCase())) return false
    return true
  })
  const [form, setForm] = useState({
    name: '', teacherId: '', phone: '+91 ', email: '', password: '123456', department: '-- Select Department --',
    subjects: '', qualification: '', experience: 0, joinDate: '', grade: '-- Select Grade --', section: '-- Select Section --'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [teacherSnap, classSnap] = await Promise.all([
        getDocs(collection(db, 'teachers')),
        getDocs(collection(db, 'classes'))
      ])
      const list = []
      teacherSnap.forEach(d => list.push({ id: d.id, ...d.data() }))
      const cls = []
      classSnap.forEach(d => cls.push({ id: d.id, ...d.data() }))
      setTeachers(list)
      setClasses(cls)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', teacherId: '', phone: '+91 ', email: '', password: '123456', department: '-- Select Department --', subjects: '', qualification: '', experience: 0, joinDate: '', grade: '-- Select Grade --', section: '-- Select Section --' })
    setProfilePic(null)
    setShowForm(true)
  }

  const openEdit = (t) => {
    const matchedClass = classes.find(c => c.teacher === t.name)
    setEditing(t.id)
    setForm({ name: t.name, teacherId: t.teacherId, phone: t.phone, email: t.email, password: t.password || '123456', department: t.department, subjects: t.subjects, qualification: t.qualification, experience: t.experience, joinDate: t.joinDate, grade: matchedClass ? matchedClass.name : t.grade, section: matchedClass ? matchedClass.section : t.section })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'teachers', editing), form)
        setTeachers(teachers.map(t => t.id === editing ? { ...t, ...form } : t))
      } else {
        const id = doc(collection(db, 'teachers')).id
        await setDoc(doc(db, 'teachers', id), form)
        setTeachers([...teachers, { id, ...form }])
      }
    } catch (err) {
      console.error('Failed to save teacher:', err)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return
    try {
      await deleteDoc(doc(db, 'teachers', id))
      setTeachers(teachers.filter(t => t.id !== id))
    } catch (err) {
      console.error('Failed to delete teacher:', err)
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
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Teachers</h1>
          <button onClick={openAdd} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">+ Add Teacher</button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Teacher</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs text-center leading-tight">{profilePic ? <img src={profilePic} className="w-full h-full rounded-full object-cover" /> : 'No image'}</div>
                <div>
                  <label className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Upload
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = () => setProfilePic(r.result); r.readAsDataURL(f) } }} />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 5MB &middot; Auto-compressed to 300&times;300</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">School Name</label>
                    <input type="text" value="DAV PUBLIC SCHOOL 1" readOnly className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">School ID</label>
                    <input type="text" value="-Os5FmgSzb9KCdbmsha4" readOnly className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Teacher full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Teacher ID <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. TCH-001" value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email (for teacher login) <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="teacher@school.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Initial Password</label>
                    <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Department <span className="text-red-500">*</span></label>
                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subjects <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. Algebra, Calculus" value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Qualification <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. M.Sc, B.Ed" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Years of Experience <span className="text-red-500">*</span></label>
                    <input type="number" min="0" value={form.experience} onChange={e => setForm({ ...form, experience: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Join Date <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="dd-mm-yyyy" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grade (Class Teacher) <span className="text-red-500">*</span></label>
                    <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} disabled={!!editing} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:dark:bg-gray-600 disabled:cursor-not-allowed">
                      {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Section <span className="text-red-500">*</span></label>
                    <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} disabled={!!editing} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:dark:bg-gray-600 disabled:cursor-not-allowed">
                      {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">{editing ? 'Update Teacher' : 'Add Teacher'}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Classes</option>
            {[...new Set(classes.map(c => c.name))].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filterSection} onChange={e => setFilterSection(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Sections</option>
            {sections.filter(s => s !== '-- Select Section --').map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input value={filterName} onChange={e => setFilterName(e.target.value)} placeholder="Search by name..." className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 flex-1 min-w-[160px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map(t => (
            <div key={t.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">{t.name.charAt(0)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.teacherId} &middot; {t.department}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.phone}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.subjects} &middot; {getGrade(t)}-{getSection(t)}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t.experience} yrs exp &middot; Joined {t.joinDate}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setViewing(t)} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition">View</button>
                <button onClick={() => openEdit(t)} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setViewing(null)}>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{viewing.name}</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Teacher ID: <span className="text-gray-900 dark:text-white">{viewing.teacherId}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Email: <span className="text-gray-900 dark:text-white">{viewing.email}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Phone: <span className="text-gray-900 dark:text-white">{viewing.phone}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Department: <span className="text-gray-900 dark:text-white">{viewing.department}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Subjects: <span className="text-gray-900 dark:text-white">{viewing.subjects}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Qualification: <span className="text-gray-900 dark:text-white">{viewing.qualification}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Experience: <span className="text-gray-900 dark:text-white">{viewing.experience} years</span></p>
                <p className="text-gray-500 dark:text-gray-400">Grade: <span className="text-gray-900 dark:text-white">{getGrade(viewing)} - {getSection(viewing)}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Joined: <span className="text-gray-900 dark:text-white">{viewing.joinDate}</span></p>
              </div>
              <button onClick={() => setViewing(null)} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
