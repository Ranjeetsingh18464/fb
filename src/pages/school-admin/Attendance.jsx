import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const students = [
  { id: 1, name: 'ramlal', username: 'ramlal123', grade: '1st Grade', section: 'A' },
  { id: 2, name: 'elvis', username: 'elvis123', grade: '1st Grade', section: 'A' },
  { id: 3, name: 'virginia', username: 'virginia123', grade: '1st Grade', section: 'A' },
  { id: 4, name: 'Aarav Sharma', username: 'aarav.s', grade: '1st Grade', section: 'A' },
  { id: 5, name: 'Priya Singh', username: 'priya.s', grade: '1st Grade', section: 'A' },
  { id: 6, name: 'Rohit Verma', username: 'rohit.v', grade: '1st Grade', section: 'B' },
  { id: 7, name: 'Sneha Patel', username: 'sneha.p', grade: '1st Grade', section: 'B' },
  { id: 8, name: 'Vikram Reddy', username: 'vikram.r', grade: '2nd Grade', section: 'A' },
]

export default function Attendance() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Mark Attendance')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [grade, setGrade] = useState('All Grades')
  const [section, setSection] = useState('All Sections')
  const [attendance, setAttendance] = useState({})

  const filtered = students.filter(s => (grade === 'All Grades' || s.grade === grade) && (section === 'All Sections' || s.section === section))

  const getStatus = (id) => attendance[id] || ''
  const setStatus = (id, status) => setAttendance({ ...attendance, [id]: status })

  const allPresent = () => {
    const a = { ...attendance }
    filtered.forEach(s => a[s.id] = 'Present')
    setAttendance(a)
  }
  const allAbsent = () => {
    const a = { ...attendance }
    filtered.forEach(s => a[s.id] = 'Absent')
    setAttendance(a)
  }

  const counts = { Present: 0, Absent: 0, Late: 0 }
  filtered.forEach(s => { if (attendance[s.id] && counts[attendance[s.id]] !== undefined) counts[attendance[s.id]]++ })

  const formatDate = () => {
    const d = new Date(date)
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">&larr; Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        </div>

        <div className="flex gap-2 mb-6">
          {['Mark Attendance', 'Records'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{t}</button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-6">
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Select Class</label>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none">
                <option>Class 1</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grade</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none">
                <option>All Grades</option>
                <option>1st Grade</option>
                <option>2nd Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Section</label>
              <select value={section} onChange={e => setSection(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none">
                <option>All Sections</option>
                <option>A</option>
                <option>B</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{counts.Present} Present</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{counts.Absent} Absent</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{counts.Late} Late</span>
            <div className="ml-auto flex gap-2">
              <button onClick={allPresent} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium">All Present</button>
              <button onClick={allAbsent} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium">All Absent</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 w-10">#</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Grade/Section</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Present</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Absent</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Late</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2">
                      <span className="text-gray-900 dark:text-white font-medium">{s.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({s.username})</span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{s.grade}&sect;{s.section}</td>
                    <td className="px-3 py-2 text-center">
                      <input type="radio" name={`att-${s.id}`} checked={getStatus(s.id) === 'Present'} onChange={() => setStatus(s.id, 'Present')} className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="radio" name={`att-${s.id}`} checked={getStatus(s.id) === 'Absent'} onChange={() => setStatus(s.id, 'Absent')} className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="radio" name={`att-${s.id}`} checked={getStatus(s.id) === 'Late'} onChange={() => setStatus(s.id, 'Late')} className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button onClick={() => alert(`Attendance saved for ${formatDate()}`)} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">Save Attendance</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
