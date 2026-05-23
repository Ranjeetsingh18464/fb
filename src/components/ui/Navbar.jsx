import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme, toggleSidebar } from '../../store/slices/themeSlice'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const roles = [
  { value: 'super_admin', label: 'Super Admin', icon: '🛡️' },
  { value: 'school_admin', label: 'School Admin', icon: '🏫' },
  { value: 'principal', label: 'Principal', icon: '👔' },
  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
  { value: 'student', label: 'Student', icon: '🎓' },
  { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦' }
]

const roleInfo = {
  super_admin: { school: 'Super Admin Panel', welcome: 'Admin', detail: () => '' },
  school_admin: { school: 'DAV PUBLIC SCHOOL', welcome: 'Admin', detail: () => '' },
  principal: { school: 'DAV PUBLIC SCHOOL', welcome: 'Principal', detail: () => '' },
  teacher: { school: 'DAV PUBLIC SCHOOL', welcome: 'mini', detail: (p) => `Teacher ID: mini123 | Grade: 1st Grade | Section: A | Department: ${p?.department || 'Mathematics'}` },
  student: { school: 'DAV PUBLIC SCHOOL', welcome: (p) => p?.name || 'Student', detail: (p) => `Student ID: ${p?.studentId || 'STU-001'} | Grade: ${p?.grade || '1st Grade'} | Section: ${p?.section || 'A'}` },
  parent: { school: 'DAV PUBLIC SCHOOL', welcome: (p) => p?.name || 'Parent', detail: (p) => `Child: ${p?.child || 'Aarav Sharma'} | Grade: ${p?.childGrade || '1st Grade'} | Section: ${p?.childSection || 'A'}` },
}

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userProfile, signOut } = useAuth()
  const { mode } = useSelector((state) => state.theme)
  const { unreadCount } = useSelector((state) => state.notification)
  const [showProfile, setShowProfile] = useState(false)

  const role = userProfile?.role || 'school_admin'
  const info = roleInfo[role] || roleInfo.school_admin
  const welcomeText = typeof info.welcome === 'function' ? info.welcome(userProfile) : info.welcome
  const detailText = info.detail(userProfile)

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-900 dark:text-white font-medium">Welcome, {welcomeText}</span>
            {detailText && <><span className="text-gray-400 dark:text-gray-500">|</span><span className="text-gray-500 dark:text-gray-400">{detailText}</span></>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <select
            value={role}
            onChange={(e) => navigate(`/dashboard/${e.target.value}`)}
            className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border-none outline-none cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.icon} {r.label}</option>
            ))}
          </select>

          <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            {mode === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <Link to="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </Link>

          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userProfile?.name?.charAt(0)?.toUpperCase() || userProfile?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{userProfile?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role.replace('_', ' ') || ''}</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">{userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{userProfile?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{userProfile?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link to="/dashboard/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profile
                    </Link>
                    <Link to="/dashboard/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </Link>
                    <button onClick={() => { setShowProfile(false); signOut() }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
