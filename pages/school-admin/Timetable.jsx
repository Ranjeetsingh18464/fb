import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const allSubjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Ed', 'Music']

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const slots = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`)

const initialData = {
  '6': [
    ['English', 'Mathematics', 'Science', 'History', 'Geography', 'Art', 'Physical Ed', 'Music'],
    ['Mathematics', 'Science', 'English', 'Geography', 'History', 'Physical Ed', 'Art', 'Music'],
    ['Science', 'English', 'History', 'Mathematics', 'Art', 'Geography', 'Music', 'Physical Ed'],
    ['History', 'Geography', 'Science', 'English', 'Music', 'Mathematics', 'Art', 'Physical Ed'],
    ['Geography', 'Art', 'Mathematics', 'Physical Ed', 'English', 'Science', 'Music', 'History'],
    ['English', 'Mathematics', 'Art', 'Music', 'Physical Ed', 'Science', 'History', 'Geography']
  ],
  '7': [
    ['Science', 'English', 'History', 'Mathematics', 'Geography', 'Art', 'Physical Ed', 'Music'],
    ['English', 'Mathematics', 'Science', 'Geography', 'History', 'Music', 'Art', 'Physical Ed'],
    ['Mathematics', 'Science', 'English', 'Art', 'Geography', 'History', 'Music', 'Physical Ed'],
    ['History', 'Geography', 'Science', 'English', 'Mathematics', 'Physical Ed', 'Art', 'Music'],
    ['Geography', 'Art', 'Mathematics', 'Science', 'English', 'History', 'Physical Ed', 'Music'],
    ['Science', 'English', 'Mathematics', 'Art', 'Geography', 'Physical Ed', 'Music', 'History']
  ],
  '8': [
    ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Ed', 'Music'],
    ['Science', 'English', 'History', 'Mathematics', 'Geography', 'Physical Ed', 'Art', 'Music'],
    ['English', 'History', 'Mathematics', 'Science', 'Art', 'Geography', 'Music', 'Physical Ed'],
    ['History', 'Geography', 'Science', 'English', 'Mathematics', 'Music', 'Art', 'Physical Ed'],
    ['Geography', 'Mathematics', 'Art', 'Physical Ed', 'English', 'Science', 'Music', 'History'],
    ['English', 'Science', 'Mathematics', 'History', 'Art', 'Physical Ed', 'Geography', 'Music']
  ],
  '9': [
    ['History', 'Mathematics', 'Science', 'English', 'Geography', 'Art', 'Physical Ed', 'Music'],
    ['English', 'Science', 'Mathematics', 'Geography', 'History', 'Music', 'Art', 'Physical Ed'],
    ['Mathematics', 'English', 'Science', 'History', 'Art', 'Geography', 'Music', 'Physical Ed'],
    ['Science', 'History', 'Geography', 'Mathematics', 'English', 'Physical Ed', 'Art', 'Music'],
    ['Geography', 'Art', 'English', 'Science', 'Mathematics', 'History', 'Physical Ed', 'Music'],
    ['English', 'Mathematics', 'Science', 'History', 'Art', 'Geography', 'Physical Ed', 'Music']
  ],
  '10': [
    ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Ed', 'Music'],
    ['Science', 'English', 'Mathematics', 'Geography', 'History', 'Physical Ed', 'Art', 'Music'],
    ['English', 'History', 'Science', 'Mathematics', 'Art', 'Geography', 'Music', 'Physical Ed'],
    ['History', 'Geography', 'English', 'Science', 'Music', 'Mathematics', 'Art', 'Physical Ed'],
    ['Geography', 'Mathematics', 'Art', 'Physical Ed', 'English', 'Science', 'Music', 'History'],
    ['Mathematics', 'English', 'Science', 'Art', 'History', 'Music', 'Geography', 'Physical Ed']
  ]
}

export default function Timetable() {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState('8')
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState(initialData)

  const timetable = data[selectedClass]

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Science': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'English': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'History': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Geography': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      'Art': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'Physical Ed': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Music': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    }
    return colors[subject] || 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400'
  }

  const updateSubject = (di, si, value) => {
    setData(prev => {
      const copy = { ...prev }
      copy[selectedClass] = copy[selectedClass].map((row, i) => i === di ? [...row] : row)
      copy[selectedClass][di][si] = value
      return copy
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/school_admin')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="page-title">Timetable</h1>
            <p className="page-subtitle">Manage class schedules and time slots</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <select className="input-field w-auto" value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setEditing(false) }}>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="btn-primary">💾 Save Timetable</button>
            <button onClick={() => { setData(initialData); setEditing(false) }} className="btn-outline">Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-primary">✏️ Edit Timetable</button>
        )}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 w-32">Time Slot</th>
                {days.map((d, i) => (
                  <th key={i} className="text-center py-3 px-3 font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, si) => (
                <tr key={si} className="group">
                  <td className="py-3 px-3 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700/50 text-xs whitespace-nowrap">{slot}</td>
                  {days.map((_, di) => {
                    const subject = timetable[di] ? timetable[di][si] : '-'
                    return (
                      <td key={di} className="text-center py-2 px-2 border-b border-gray-100 dark:border-gray-700/50">
                        {editing ? (
                          <select className="input-field text-xs py-1 px-1 w-full min-w-[80px]" value={subject} onChange={e => updateSubject(di, si, e.target.value)}>
                            {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : subject !== '-' ? (
                          <span className={`inline-block text-xs font-medium px-2.5 py-1.5 rounded-lg ${getSubjectColor(subject)}`}>{subject}</span>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Subject Legend</h3>
          <div className="flex flex-wrap gap-2">
            {allSubjects.map((s, i) => (
              <span key={i} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${getSubjectColor(s)}`}>{s}</span>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4">Quick Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500 dark:text-gray-400">Total Periods</p><p className="font-semibold text-gray-900 dark:text-white">{slots.length} per day</p></div>
            <div><p className="text-gray-500 dark:text-gray-400">Working Days</p><p className="font-semibold text-gray-900 dark:text-white">{days.length} days/week</p></div>
            <div><p className="text-gray-500 dark:text-gray-400">Subjects</p><p className="font-semibold text-gray-900 dark:text-white">{allSubjects.length} subjects</p></div>
            <div><p className="text-gray-500 dark:text-gray-400">Break</p><p className="font-semibold text-gray-900 dark:text-white">11:15 - 11:30</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
