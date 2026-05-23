import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Total Teachers', value: '68', icon: '👨‍🏫' },
  { label: 'Total Students', value: '1,245', icon: '👩‍🎓' },
  { label: 'Total Classes', value: '32', icon: '📚' },
  { label: 'Avg Attendance', value: '94%', icon: '📊' },
];

const recentActivity = [
  { action: 'New teacher joined', detail: 'Mr. Sharma - Mathematics', time: '2 hours ago' },
  { action: 'Event approved', detail: 'Annual Sports Day', time: '4 hours ago' },
  { action: 'Report generated', detail: 'Mid-term progress report', time: '1 day ago' },
  { action: 'Notice published', detail: 'Holiday announcement', time: '2 days ago' },
  { action: 'Fee collection', detail: 'April fees - 85% collected', time: '3 days ago' },
];

const teacherPerformance = [
  { name: 'Ms. Priya', rating: 4.8, subject: 'Mathematics' },
  { name: 'Mr. Rajesh', rating: 4.6, subject: 'Science' },
  { name: 'Mrs. Anita', rating: 4.5, subject: 'English' },
  { name: 'Mr. Vikram', rating: 4.3, subject: 'History' },
  { name: 'Ms. Neha', rating: 4.2, subject: 'Computer Science' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Principal Dashboard</h1>
        <p>Welcome back, Principal. Here's your school overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-lg mb-4">Teacher Performance Overview</h3>
          <div className="space-y-4">
            {teacherPerformance.map((teacher) => (
              <div key={teacher.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{teacher.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: `${(teacher.rating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{teacher.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                <p className="font-medium text-sm dark:text-gray-200">{item.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/dashboard/principal/teachers')} className="btn-primary">Add New Teacher</button>
          <button onClick={() => navigate('/dashboard/principal/events')} className="btn-primary">Create Event</button>
          <button onClick={() => navigate('/dashboard/principal/reports')} className="btn-primary">Generate Report</button>
          <button onClick={() => navigate('/dashboard/principal/announcements')} className="btn-primary">Send Announcement</button>
          <button onClick={() => navigate('/dashboard/principal/analytics')} className="btn-primary">View Analytics</button>
        </div>
      </div>
    </div>
  );
}
