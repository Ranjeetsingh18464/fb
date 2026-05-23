import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialPendingEvents = [
  { id: 1, title: 'Annual Sports Day', proposedBy: 'Mr. Rajesh', date: '2026-06-15', venue: 'School Ground', status: 'Pending' },
  { id: 2, title: 'Science Exhibition', proposedBy: 'Mrs. Anita', date: '2026-06-20', venue: 'Science Lab', status: 'Pending' },
  { id: 3, title: 'Parent-Teacher Meet', proposedBy: 'Principal', date: '2026-05-25', venue: 'School Auditorium', status: 'Pending' },
];

const initialUpcomingEvents = [
  { id: 4, title: 'Independence Day Celebration', date: '2026-08-15', venue: 'School Ground', status: 'Approved' },
  { id: 5, title: 'Workshop on AI', date: '2026-06-10', venue: 'Computer Lab', status: 'Approved' },
  { id: 6, title: 'Inter-School Debate', date: '2026-07-05', venue: 'Auditorium', status: 'Approved' },
];

const initialPastEvents = [
  { id: 7, title: 'Annual Day 2025', date: '2025-12-20', venue: 'School Ground', status: 'Completed' },
  { id: 8, title: 'Republic Day 2026', date: '2026-01-26', venue: 'School Ground', status: 'Completed' },
  { id: 9, title: 'Summer Camp', date: '2026-04-30', venue: 'School Campus', status: 'Completed' },
];

export default function Events() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('pending');
  const [pendingEvents, setPendingEvents] = useState(initialPendingEvents);
  const [upcomingEvents, setUpcomingEvents] = useState(initialUpcomingEvents);
  const [pastEvents, setPastEvents] = useState(initialPastEvents);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [viewEvent, setViewEvent] = useState(null);

  const handleApprove = (id) => {
    const event = pendingEvents.find(e => e.id === id);
    setPendingEvents(pendingEvents.filter(e => e.id !== id));
    setUpcomingEvents([...upcomingEvents, { ...event, status: 'Approved' }]);
  };

  const handleReject = (id) => {
    setPendingEvents(pendingEvents.filter(e => e.id !== id));
  };

  const handleCreateEvent = () => {
    if (!newTitle || !newDate || !newVenue) return;
    const event = {
      id: Date.now(),
      title: newTitle,
      proposedBy: 'Principal',
      date: newDate,
      venue: newVenue,
      status: 'Pending'
    };
    setPendingEvents([event, ...pendingEvents]);
    setNewTitle(''); setNewDate(''); setNewVenue('');
    setShowForm(false);
    setTab('pending');
  };

  const renderTable = (events, showApprove = false) => (
    <div className="card overflow-x-auto">
      <table className="w-full text-left">
        <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-3 px-4 font-semibold text-sm">Title</th>
            {!showApprove && <th className="py-3 px-4 font-semibold text-sm">Proposed By</th>}
            <th className="py-3 px-4 font-semibold text-sm">Date</th>
            <th className="py-3 px-4 font-semibold text-sm">Venue</th>
            <th className="py-3 px-4 font-semibold text-sm">Status</th>
            <th className="py-3 px-4 font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="py-3 px-4 font-medium">{event.title}</td>
              {!showApprove && <td className="py-3 px-4">{event.proposedBy}</td>}
              <td className="py-3 px-4">{event.date}</td>
              <td className="py-3 px-4">{event.venue}</td>
              <td className="py-3 px-4">
                <span className={`badge-${event.status === 'Pending' ? 'warning' : event.status === 'Approved' ? 'success' : 'info'}`}>
                  {event.status}
                </span>
              </td>
              <td className="py-3 px-4 space-x-2">
                {showApprove && (
                  <>
                    <button onClick={() => handleApprove(event.id)} className="text-green-600 hover:underline text-sm">Approve</button>
                    <button onClick={() => handleReject(event.id)} className="text-red-600 hover:underline text-sm">Reject</button>
                  </>
                )}
                <button onClick={() => setViewEvent(event)} className="text-blue-600 hover:underline text-sm">View</button>
                <button onClick={() => {
                  if (!confirm('Delete this event?')) return;
                  setPendingEvents(pendingEvents.filter(e => e.id !== event.id));
                  setUpcomingEvents(upcomingEvents.filter(e => e.id !== event.id));
                  setPastEvents(pastEvents.filter(e => e.id !== event.id));
                }} className="text-red-600 hover:underline text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
            <h1>Event Management</h1>
            <p>Manage and approve school events.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          onClick={() => setTab('pending')}
        >
          Pending Approval ({pendingEvents.length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          onClick={() => setTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          onClick={() => setTab('past')}
        >
          Past Events
        </button>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary ml-auto">+ Create Event</button>
      </div>

      {showForm && (
        <div className="card mb-6 p-4">
          <h3 className="font-semibold mb-4">New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="input-field" placeholder="Event title" />
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="input-field" />
            <input value={newVenue} onChange={e => setNewVenue(e.target.value)} className="input-field" placeholder="Venue" />
            <div className="flex gap-2">
              <button onClick={handleCreateEvent} className="btn-primary flex-1">Create</button>
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'pending' && renderTable(pendingEvents, true)}
      {tab === 'upcoming' && renderTable(upcomingEvents)}
      {tab === 'past' && renderTable(pastEvents)}

      {viewEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewEvent(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{viewEvent.title}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Proposed By:</span> {viewEvent.proposedBy || 'N/A'}</p>
              <p><span className="font-medium">Date:</span> {viewEvent.date}</p>
              <p><span className="font-medium">Venue:</span> {viewEvent.venue}</p>
              <p><span className="font-medium">Status:</span> {viewEvent.status}</p>
            </div>
            <button onClick={() => setViewEvent(null)} className="btn-primary mt-4 w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
