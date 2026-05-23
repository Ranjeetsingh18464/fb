import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme, toggleSidebar } from '../store/slices/themeSlice'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/ui/Sidebar'
import Navbar from '../components/ui/Navbar'
import { useAuth } from '../contexts/AuthContext'

export default function MainLayout() {
  const dispatch = useDispatch()
  const { sidebarOpen, sidebarPosition, compactMode } = useSelector((state) => state.theme)
  const { userProfile } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarPosition === 'right'
          ? sidebarOpen
            ? compactMode ? 'mr-48' : 'mr-64'
            : 'mr-20'
          : sidebarOpen
            ? compactMode ? 'ml-48' : 'ml-64'
            : 'ml-20'
      }`}>
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
