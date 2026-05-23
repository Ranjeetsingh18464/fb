import React from 'react';

const stats = [
  { label: 'My Classes', value: '4', icon: '📚' },
  { label: 'Total Students', value: '156', icon: '👩‍🎓' },
  { label: 'Pending Homework', value: '8', icon: '📝' },
  { label: "Today's Attendance", value: '94%', icon: '📊' },
];

const schedule = [
  { time: '08:00 - 08:45', subject: 'Mathematics', class: '10A', room: '101' },
  { time: '08:45 - 09:30', subject: 'Mathematics', class: '10B', room: '102' },
  { time: '09:30 - 10:15', subject: 'Free Period', class: '-', room: '-' },
  { time: '10:15 - 11:00', subject: 'Mathematics', class: '9A', room: '103' },
  { time: '11:00 - 11:30', subject: 'Break', class: '-', room: '-' },
  { time: '11:30 - 12:15', subject: 'Mathematics', class: '9B', room: '104' },
  { time: '12:15 - 13:00', subject: 'Doubt Session', class: 'All', room: '101' },
];

const recentActivity = [
  { action: 'Homework assigned', detail: 'Chapter 5 - Class 10A', time: '1 hour ago' },
  { action: 'Attendance marked', detail: 'Class 9A - 28/30 present', time: '3 hours ago' },
  { action: 'Marks entered', detail: 'Math Test - Class 10B', time: '5 hours ago' },
  { action: 'Notes uploaded', detail: 'Algebra Basics - PDF', time: '1 day ago' },
];

export default function Dashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back! Here's your class overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-lg mb-4">Today's Schedule</h3>
          <div className="space-y-2">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <span className="w-28 text-sm font-medium text-gray-600">{item.time}</span>
                <span className="flex-1 font-medium">{item.subject}</span>
                {item.class !== '-' && (
                  <span className="badge-info text-xs mr-2">{item.class}</span>
                )}
                {item.room !== '-' && (
                  <span className="text-sm text-gray-500">Room {item.room}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                <p className="font-medium text-sm">{item.action}</p>
                <p className="text-xs text-gray-500">{item.detail}</p>
                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">Mark Attendance</button>
          <button className="btn-primary">Assign Homework</button>
          <button className="btn-primary">Enter Marks</button>
          <button className="btn-primary">Upload Notes</button>
          <button className="btn-primary">Create Quiz</button>
          <button className="btn-primary">Send Notice</button>
        </div>
      </div>
    </div>
  );
}
