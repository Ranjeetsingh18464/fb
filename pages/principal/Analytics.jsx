import { useNavigate } from 'react-router-dom';

const classPerformance = [
  { class: '10A', avgScore: 85, students: 42 },
  { class: '10B', avgScore: 78, students: 38 },
  { class: '9A', avgScore: 82, students: 40 },
  { class: '9B', avgScore: 76, students: 36 },
  { class: '8A', avgScore: 88, students: 35 },
  { class: '8B', avgScore: 80, students: 34 },
];

const subjectPassRate = [
  { subject: 'Mathematics', passRate: 82 },
  { subject: 'Science', passRate: 88 },
  { subject: 'English', passRate: 91 },
  { subject: 'History', passRate: 85 },
  { subject: 'Computer Science', passRate: 94 },
  { subject: 'Physics', passRate: 80 },
];

const attendanceTrends = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 93 },
  { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 94 },
  { month: 'May', rate: 93 },
  { month: 'Jun', rate: 95 },
];

const teacherEvals = [
  { teacher: 'Ms. Priya Sharma', score: 4.8, feedback: 42 },
  { teacher: 'Mrs. Sunita Reddy', score: 4.7, feedback: 38 },
  { teacher: 'Mr. Rajesh Kumar', score: 4.6, feedback: 35 },
  { teacher: 'Mrs. Anita Verma', score: 4.5, feedback: 40 },
  { teacher: 'Mr. Vikram Singh', score: 4.3, feedback: 28 },
];

export default function Analytics() {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/principal')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1>School Analytics</h1>
            <p>Comprehensive analysis of school performance metrics.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Class Performance</h3>
          <div className="space-y-3">
            {classPerformance.map((item) => (
              <div key={item.class} className="flex items-center gap-4">
                <span className="w-12 font-medium text-sm">{item.class}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-blue-600 rounded-full h-3"
                    style={{ width: `${item.avgScore}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-10">{item.avgScore}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-12">{item.students} students</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Subject-wise Pass Rate</h3>
          <div className="space-y-3">
            {subjectPassRate.map((item) => (
              <div key={item.subject} className="flex items-center gap-4">
                <span className="w-36 font-medium text-sm">{item.subject}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-green-500 rounded-full h-3"
                    style={{ width: `${item.passRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{item.passRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Attendance Trends</h3>
          <div className="flex items-end justify-between h-40 px-2">
            {attendanceTrends.map((item) => (
              <div key={item.month} className="flex flex-col items-center gap-2">
                <span className="text-xs font-semibold">{item.rate}%</span>
                <div
                  className="bg-indigo-500 w-8 rounded-t"
                  style={{ height: `${item.rate * 1.5}px` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Teacher Evaluations</h3>
          <div className="space-y-3">
            {teacherEvals.map((item) => (
              <div key={item.teacher} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.teacher}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.feedback} feedback responses</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-yellow-500 rounded-full h-2"
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
