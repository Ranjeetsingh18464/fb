import React, { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const periods = [
  '08:00 - 08:45',
  '08:45 - 09:30',
  '09:30 - 10:15',
  '10:15 - 11:00',
  '11:00 - 11:30',
  '11:30 - 12:15',
  '12:15 - 13:00',
];

const timetableData = {
  Monday: [
    { subject: 'Mathematics', class: '10A', room: '101', color: 'bg-blue-100 border-blue-400' },
    { subject: 'Mathematics', class: '10B', room: '102', color: 'bg-green-100 border-green-400' },
    null,
    { subject: 'Free', class: '', room: '', color: 'bg-gray-100 border-gray-300' },
    null,
    { subject: 'Mathematics', class: '9A', room: '103', color: 'bg-purple-100 border-purple-400' },
    { subject: 'Doubt Session', class: 'All', room: '101', color: 'bg-yellow-100 border-yellow-400' },
  ],
  Tuesday: [
    { subject: 'Mathematics', class: '9B', room: '104', color: 'bg-orange-100 border-orange-400' },
    { subject: 'Free', class: '', room: '', color: 'bg-gray-100 border-gray-300' },
    { subject: 'Mathematics', class: '10A', room: '101', color: 'bg-blue-100 border-blue-400' },
    { subject: 'Mathematics', class: '10B', room: '102', color: 'bg-green-100 border-green-400' },
    null,
    { subject: 'Free', class: '', room: '', color: 'bg-gray-100 border-gray-300' },
    { subject: 'Mathematics', class: '9A', room: '103', color: 'bg-purple-100 border-purple-400' },
  ],
  Wednesday: [
    { subject: 'Free', class: '', room: '', color: 'bg-gray-100 border-gray-300' },
    { subject: 'Mathematics', class: '9A', room: '103', color: 'bg-purple-100 border-purple-400' },
    { subject: 'Mathematics', class: '9B', room: '104', color: 'bg-orange-100 border-orange-400' },
    { subject: 'Mathematics', class: '10A', room: '101', color: 'bg-blue-100 border-blue-400' },
    null,
    { subject: 'Mathematics', class: '10B', room: '102', color: 'bg-green-100 border-green-400' },
    { subject: 'Doubt Session', class: 'All', room: '101', color: 'bg-yellow-100 border-yellow-400' },
  ],
  Thursday: [
    { subject: 'Mathematics', class: '10B', room: '102', color: 'bg-green-100 border-green-400' },
    { subject: 'Free', class: '', room: '', color: 'bg-gray-100 border-gray-300' },
    { subject: 'Mathematics', class: '10A', room: '101', color: 'bg-blue-100 border-blue-400' },
    null,
    null,
    { subject: 'Mathematics', class: '9A', room: '103', color: 'bg-purple-100 border-purple-400' },
    { subject: 'Mathematics', class: '9B', room: '104', color: 'bg-orange-100 border-orange-400' },
  ],
  Friday: [
    { subject: 'Free', class: '', room: '', color: 'bg-gray-100 border-gray-300' },
    { subject: 'Mathematics', class: '9A', room: '103', color: 'bg-purple-100 border-purple-400' },
    { subject: 'Mathematics', class: '9B', room: '104', color: 'bg-orange-100 border-orange-400' },
    { subject: 'Mathematics', class: '10B', room: '102', color: 'bg-green-100 border-green-400' },
    null,
    { subject: 'Mathematics', class: '10A', room: '101', color: 'bg-blue-100 border-blue-400' },
    { subject: 'Free', class: '', room: '', color: 'bg-gray-100 border-gray-300' },
  ],
};

export default function Timetable() {
  const [currentDay, setCurrentDay] = useState('Monday');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Timetable</h1>
        <p>View your weekly class schedule.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {days.map((day) => (
          <button
            key={day}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentDay === day
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setCurrentDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">{currentDay}</h3>
        <div className="space-y-2">
          {periods.map((period, idx) => {
            const slot = timetableData[currentDay]?.[idx];
            return (
              <div
                key={idx}
                className={`flex items-center p-3 rounded-lg border ${
                  slot ? slot.color : 'border-gray-100 bg-gray-50'
                }`}
              >
                <span className="w-28 text-sm font-medium text-gray-600">{period}</span>
                {slot ? (
                  <>
                    <span className="flex-1 font-medium">{slot.subject}</span>
                    {slot.class && (
                      <span className="badge-info text-xs mr-2">{slot.class}</span>
                    )}
                    {slot.room && (
                      <span className="text-sm text-gray-500">Room {slot.room}</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">Break</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
