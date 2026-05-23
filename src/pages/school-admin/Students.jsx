import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from '../../services/firebase'

const grades = ['-- Select Grade --', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const sections = ['-- Select Section --', 'A', 'B', 'C', 'D', 'E']

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [filterGrade, setFilterGrade] = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [filterName, setFilterName] = useState('')

  const filteredStudents = students.filter(s => {
    if (filterGrade && s.grade !== filterGrade) return false
    if (filterSection && s.section !== filterSection) return false
    if (filterName && !s.name.toLowerCase().includes(filterName.toLowerCase())) return false
    return true
  })
  const [form, setForm] = useState({ name: '', studentId: '', email: '', phone: '+91 ', password: '123456', grade: '-- Select Grade --', section: '-- Select Section --', parent: '', parentPhone: '+91 ', address: '' })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'students'))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setStudents(list)
    } catch (err) {
      console.error('Failed to load students:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', studentId: '', email: '', phone: '+91 ', password: '123456', grade: '-- Select Grade --', section: '-- Select Section --', parent: '', parentPhone: '+91 ', address: '' })
    setProfilePic(null)
    setShowForm(true)
  }

  const openEdit = (s) => {
    setEditing(s.id)
    setForm({ name: s.name, studentId: s.studentId, email: s.email, phone: s.phone, password: s.password || '123456', grade: s.grade, section: s.section, parent: s.parent, parentPhone: s.parentPhone, address: s.address })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      let studentId
      if (editing) {
        await updateDoc(doc(db, 'students', editing), form)
        setStudents(students.map(s => s.id === editing ? { ...s, ...form } : s))
        studentId = editing
      } else {
        const id = doc(collection(db, 'students')).id
        await setDoc(doc(db, 'students', id), form)
        setStudents([...students, { id, ...form }])
        studentId = id
      }

      if (form.parent) {
        const parentSnap = await getDocs(query(collection(db, 'parents'), where('name', '==', form.parent)))
        if (!parentSnap.empty) {
          const parentDoc = parentSnap.docs[0]
          const existingChildren = parentDoc.data().children || []
          if (!existingChildren.includes(form.name)) {
            await updateDoc(doc(db, 'parents', parentDoc.id), { children: [...existingChildren, form.name] })
          }
        } else if (!editing) {
          const parentId = doc(collection(db, 'parents')).id
          await setDoc(doc(db, 'parents', parentId), { name: form.parent, email: '', phone: form.parentPhone || '', children: [form.name] })
        }
      }
    } catch (err) {
      console.error('Failed to save student:', err)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    try {
      const student = students.find(s => s.id === id)
      if (student?.parent) {
        const parentSnap = await getDocs(query(collection(db, 'parents'), where('name', '==', student.parent)))
        if (!parentSnap.empty) {
          const parentDoc = parentSnap.docs[0]
          const children = (parentDoc.data().children || []).filter(c => c !== student.name)
          await updateDoc(doc(db, 'parents', parentDoc.id), { children })
        }
      }
      await deleteDoc(doc(db, 'students', id))
      setStudents(students.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete student:', err)
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <button onClick={openAdd} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">+ Add Student</button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Student</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs text-center leading-tight">{profilePic ? <img src={profilePic} className="w-full h-full rounded-full object-cover" /> : 'No image'}</div>
                <div>
                  <label className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = () => setProfilePic(r.result); r.readAsDataURL(f) } }} />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPEG, PNG, GIF, WEBP &middot; Max 5MB &middot; Auto-compressed to 300&times;300</p>
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
                    <input type="text" placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Student ID <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. STU-001" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email (for student login) <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="student@school.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Initial Password</label>
                    <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grade <span className="text-red-500">*</span></label>
                    <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                      {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Section <span className="text-red-500">*</span></label>
                    <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                      {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Parent / Guardian</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Parent Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Guardian full name" value={form.parent} onChange={e => setForm({ ...form, parent: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Parent Phone <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="+91 9876543210" value={form.parentPhone} onChange={e => setForm({ ...form, parentPhone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Address <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter home address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">{editing ? 'Update Student' : 'Add Student'}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Grades</option>
            {grades.filter(g => g !== '-- Select Grade --').map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filterSection} onChange={e => setFilterSection(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Sections</option>
            {sections.filter(s => s !== '-- Select Section --').map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input value={filterName} onChange={e => setFilterName(e.target.value)} placeholder="Search by name..." className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 flex-1 min-w-[160px]" />
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Grade</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Section</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Parent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Phone</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{s.studentId}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.grade}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.section}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.parent}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.phone}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setViewing(s)} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition mr-1">View</button>
                    <button onClick={() => openEdit(s)} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition mr-1">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setViewing(null)}>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{viewing.name}</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Student ID: <span className="text-gray-900 dark:text-white">{viewing.studentId}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Email: <span className="text-gray-900 dark:text-white">{viewing.email}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Phone: <span className="text-gray-900 dark:text-white">{viewing.phone}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Grade: <span className="text-gray-900 dark:text-white">{viewing.grade} - {viewing.section}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Parent: <span className="text-gray-900 dark:text-white">{viewing.parent}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Parent Phone: <span className="text-gray-900 dark:text-white">{viewing.parentPhone}</span></p>
                <p className="text-gray-500 dark:text-gray-400">Address: <span className="text-gray-900 dark:text-white">{viewing.address}</span></p>
              </div>
              <button onClick={() => setViewing(null)} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
