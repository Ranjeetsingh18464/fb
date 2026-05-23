import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const periods = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`)

const subjectOptions = ['Mathematics', 'English', 'Science', 'Hindi', 'Sanskrit', 'Computer', 'Art', 'Music', 'Physical Education', '-- Free --']
const teacherOptions = ['Anita Desai', 'Rajesh Kumar', 'Meena Joshi', 'Sunita Sharma', 'Vikram Rao', '-- Free --']

const initialCells = {}
for (const day of days) {
  for (const period of periods) {
    initialCells[`${day}-${period}`] = { subject: '-- Free --', teacher: '-- Free --' }
  }
}

export default function Timetable() {
  const navigate = useNavigate()
  const [cells, setCells] = useState(initialCells)
  const [selectedClass, setSelectedClass] = useState('Class 1A')

  const updateCell = (day, period, field, value) => {
    setCells({ ...cells, [`${day}-${period}`]: { ...cells[`${day}-${period}`], [field]: value } })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">← Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Timetable</h1>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="ml-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option>Class 1A</option>
            <option>Class 1B</option>
            <option>Class 2A</option>
            <option>Class 2B</option>
          </select>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">Period</th>
                {days.map(day => (
                  <th key={day} className="px-3 py-3 font-medium text-gray-500 dark:text-gray-400 text-center min-w-[130px]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr key={period} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="sticky left-0 bg-white dark:bg-gray-800 z-10 px-3 py-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{period}</td>
                  {days.map(day => {
                    const cell = cells[`${day}-${period}`] || { subject: '-- Free --', teacher: '-- Free --' }
                    return (
                      <td key={day} className="px-2 py-2">
                        <div className="space-y-1">
                          <select value={cell.subject} onChange={e => updateCell(day, period, 'subject', e.target.value)} className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs">
                            {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <select value={cell.teacher} onChange={e => updateCell(day, period, 'teacher', e.target.value)} className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs">
                            {teacherOptions.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Click the dropdowns in each cell to assign a subject and teacher. Use "-- Free --" for unscheduled periods.</p>
      </div>
    </div>
  )
}
