import { useState } from 'react'

export default function Subjects() {
  const [subjects] = useState([
    { id: 1, name: 'Mathematics', code: 'MTH101', teacher: 'Ms. Sarah Johnson', class: '6, 7, 8', students: 182, status: 'active' },
    { id: 2, name: 'Science', code: 'SCI101', teacher: 'Mr. James Williams', class: '7, 8, 9', students: 156, status: 'active' },
    { id: 3, name: 'English', code: 'ENG101', teacher: 'Mrs. Emily Davis', class: '6, 7, 8', students: 178, status: 'active' },
    { id: 4, name: 'History', code: 'HIS101', teacher: 'Mr. Robert Brown', class: '8, 9', students: 112, status: 'active' },
    { id: 5, name: 'Geography', code: 'GEO101', teacher: 'Ms. Lisa Wilson', class: '6, 7', students: 98, status: 'active' },
    { id: 6, name: 'Physics', code: 'PHY101', teacher: 'Mr. David Taylor', class: '9, 10', students: 86, status: 'active' },
    { id: 7, name: 'Chemistry', code: 'CHM101', teacher: 'Mrs. Nancy White', class: '9, 10', students: 84, status: 'inactive' },
    { id: 8, name: 'Computer Science', code: 'CSC101', teacher: 'Mr. Michael Lee', class: '8, 9, 10', students: 94, status: 'active' },
    { id: 9, name: 'Art', code: 'ART101', teacher: 'Ms. Emma Green', class: '6, 7', students: 65, status: 'active' },
    { id: 10, name: 'Physical Education', code: 'PED101', teacher: 'Mr. Kevin Clark', class: '6, 7, 8, 9, 10', students: 312, status: 'active' }
  ])

  const getSubjectColor = (name) => {
    const colors = {
      'Mathematics': 'bg-blue-500',
      'Science': 'bg-green-500',
      'English': 'bg-purple-500',
      'History': 'bg-amber-500',
      'Geography': 'bg-teal-500',
      'Physics': 'bg-cyan-500',
      'Chemistry': 'bg-pink-500',
      'Computer Science': 'bg-indigo-500',
      'Art': 'bg-rose-500',
      'Physical Education': 'bg-orange-500'
    }
    return colors[name] || 'bg-gray-500'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-subtitle">Manage school curriculum subjects and teacher assignments</p>
        </div>
        <button className="btn-primary">➕ Add Subject</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Subject</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Code</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Teacher</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Class</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500">Students</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${getSubjectColor(s.name)} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                        {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono text-xs text-gray-500">{s.code}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{s.teacher}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-1">
                      {s.class.split(', ').map((c, ci) => (
                        <span key={ci} className="text-xs bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">Cls {c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{s.students}</td>
                  <td className="py-3 px-2">
                    {s.status === 'active'
                      ? <span className="badge-success">Active</span>
                      : <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-full">Inactive</span>
                    }
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="text-primary-600 hover:text-primary-800 text-xs font-medium mr-2">Edit</button>
                    <button className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
