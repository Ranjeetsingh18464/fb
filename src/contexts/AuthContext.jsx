import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const roleFromPath = (pathname) => {
  const match = pathname.match(/\/dashboard\/(\w+)/)
  return match ? match[1] : 'school_admin'
}

const defaultProfile = {
  id: 'demo-admin-id',
  name: 'School Admin',
  email: 'admin@school.com',
  role: 'school_admin',
  isApproved: true,
  isActive: true,
  school: 'Springfield High School',
  xp: 0,
  level: 1,
  streak: 0
}

const roleNames = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  principal: 'Principal',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent'
}

const roleIcons = {
  super_admin: '🛡️',
  school_admin: '🏫',
  principal: '👔',
  teacher: '👨‍🏫',
  student: '🎓',
  parent: '👨‍👩‍👧‍👦'
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const location = useLocation()
  const [user] = useState({ uid: defaultProfile.id, email: defaultProfile.email })
  const currentRole = roleFromPath(location.pathname)
  const [userProfile, setUserProfile] = useState({ ...defaultProfile, role: currentRole })
  const [loading] = useState(false)
  const [error] = useState(null)

  useEffect(() => {
    setUserProfile(prev => ({ ...prev, role: currentRole, name: roleNames[currentRole] || 'User' }))
  }, [currentRole])

  const signIn = async () => ({ user })
  const signUp = async () => ({ user })
  const signOut = async () => {}
  const resetPassword = async () => {}
  const refreshProfile = async () => {}

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, error, signIn, signUp, signOut, resetPassword,
      refreshProfile, isAuthenticated: true, role: currentRole, isApproved: true,
      roleNames, roleIcons
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
