import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { doc, getDoc } from './services/firebase'
import { db } from './services/firebase'
import { setSchoolSettings } from './store/slices/themeSlice'

import MainLayout from './layouts/MainLayout'

import SuperAdminDashboard from './pages/super-admin/Dashboard'
import SuperAdminSchools from './pages/super-admin/Schools'
import SuperAdminAnalytics from './pages/super-admin/Analytics'
import SuperAdminUsers from './pages/super-admin/Users'
import SuperAdminRevenue from './pages/super-admin/Revenue'
import SuperAdminPlans from './pages/super-admin/Plans'
import SuperAdminModeration from './pages/super-admin/Moderation'
import SuperAdminAdControls from './pages/super-admin/AdControls'
import SuperAdminSystem from './pages/super-admin/System'

import SchoolAdminDashboard from './pages/school-admin/Dashboard'
import SchoolAdminClasses from './pages/school-admin/Classes'
import SchoolAdminSubjects from './pages/school-admin/Subjects'
import SchoolAdminTeachers from './pages/school-admin/Teachers'
import SchoolAdminStudents from './pages/school-admin/Students'
import SchoolAdminParents from './pages/school-admin/Parents'
import SchoolAdminFees from './pages/school-admin/Fees'
import SchoolAdminAttendance from './pages/school-admin/Attendance'
import SchoolAdminHomework from './pages/school-admin/Homework'
import SchoolAdminEvents from './pages/school-admin/Events'
import SchoolAdminTimetable from './pages/school-admin/Timetable'
import SchoolAdminAnnouncements from './pages/school-admin/Announcements'
import SchoolAdminCustomization from './pages/school-admin/Customization'
import SchoolAdminModeration from './pages/school-admin/Moderation'

import PrincipalDashboard from './pages/principal/Dashboard'
import PrincipalTeachers from './pages/principal/Teachers'
import PrincipalClasses from './pages/principal/Classes'
import PrincipalStudents from './pages/principal/Students'
import PrincipalAnalytics from './pages/principal/Analytics'
import PrincipalReports from './pages/principal/Reports'
import PrincipalEvents from './pages/principal/Events'
import PrincipalAnnouncements from './pages/principal/Announcements'

import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherHomework from './pages/teacher/Homework'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherMarks from './pages/teacher/Marks'
import TeacherResults from './pages/teacher/Results'
import TeacherTimetable from './pages/teacher/Timetable'
import TeacherNotes from './pages/teacher/Notes'
import TeacherQuizzes from './pages/teacher/Quizzes'
import TeacherAssignments from './pages/teacher/Assignments'
import TeacherGroups from './pages/teacher/Groups'
import TeacherGroupDetail from './pages/teacher/GroupDetail'
import TeacherCommunication from './pages/teacher/Communication'
import TeacherClassNotices from './pages/teacher/ClassNotices'

import StudentDashboard from './pages/student/Dashboard'
import StudentHomework from './pages/student/Homework'
import StudentTimetable from './pages/student/Timetable'
import StudentAttendance from './pages/student/Attendance'
import StudentResults from './pages/student/Results'
import StudentAssignments from './pages/student/Assignments'
import StudentNotes from './pages/student/Notes'
import StudentAchievements from './pages/student/Achievements'
import StudentQuizzes from './pages/student/Quizzes'
import StudentGroups from './pages/student/Groups'
import StudentAiAssistant from './pages/student/AiAssistant'
import StudentStudyPlanner from './pages/student/StudyPlanner'
import StudentProgress from './pages/student/Progress'
import StudentExamSchedule from './pages/student/ExamSchedule'

import ParentDashboard from './pages/parent/Dashboard'
import ParentChildAttendance from './pages/parent/ChildAttendance'
import ParentChildResults from './pages/parent/ChildResults'
import ParentChildHomework from './pages/parent/ChildHomework'
import ParentFees from './pages/parent/Fees'
import ParentNotices from './pages/parent/Notices'
import ParentCommunication from './pages/parent/Communication'
import ParentChildTimetable from './pages/parent/ChildTimetable'
import ParentChildAchievements from './pages/parent/ChildAchievements'
import ParentChildPerformance from './pages/parent/ChildPerformance'

import CommunityFeed from './pages/community/Feed'
import CommunityGroups from './pages/community/Groups'
import CommunityGroupDetail from './pages/community/GroupDetail'
import CommunityDoubts from './pages/community/Doubts'
import CommunityAchievementWall from './pages/community/AchievementWall'

import ChatPage from './pages/shared/Chat'
import NotificationsPage from './pages/shared/Notifications'
import FilesPage from './pages/shared/Files'
import ProfilePage from './pages/shared/Profile'
import SettingsPage from './pages/shared/Settings'

export default function App() {
  const dispatch = useDispatch()
  const themeMode = useSelector((state) => state.theme.mode)
  const themeColor = useSelector((state) => state.theme.themeColor)

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [themeMode])

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColor)
  }, [themeColor])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'school_customization'))
        if (snap.exists()) {
          dispatch(setSchoolSettings(snap.data()))
        }
      } catch (err) {
        console.error('Failed to load school settings:', err)
      }
    }
    loadSettings()
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/school_admin" replace />} />

      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Navigate to="school_admin" replace />} />

        <Route path="super_admin" element={<Outlet />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="schools" element={<SuperAdminSchools />} />
          <Route path="analytics" element={<SuperAdminAnalytics />} />
          <Route path="users" element={<SuperAdminUsers />} />
          <Route path="revenue" element={<SuperAdminRevenue />} />
          <Route path="plans" element={<SuperAdminPlans />} />
          <Route path="moderation" element={<SuperAdminModeration />} />
          <Route path="ad-controls" element={<SuperAdminAdControls />} />
          <Route path="system" element={<SuperAdminSystem />} />
        </Route>

        <Route path="school_admin" element={<Outlet />}>
          <Route index element={<SchoolAdminDashboard />} />
          <Route path="classes" element={<SchoolAdminClasses />} />
          <Route path="subjects" element={<SchoolAdminSubjects />} />
          <Route path="teachers" element={<SchoolAdminTeachers />} />
          <Route path="students" element={<SchoolAdminStudents />} />
          <Route path="parents" element={<SchoolAdminParents />} />
          <Route path="fees" element={<SchoolAdminFees />} />
          <Route path="attendance" element={<SchoolAdminAttendance />} />
          <Route path="homework" element={<SchoolAdminHomework />} />
          <Route path="events" element={<SchoolAdminEvents />} />
          <Route path="timetable" element={<SchoolAdminTimetable />} />
          <Route path="announcements" element={<SchoolAdminAnnouncements />} />
          <Route path="moderation" element={<SchoolAdminModeration />} />
          <Route path="customization" element={<SchoolAdminCustomization />} />
        </Route>

        <Route path="principal" element={<Outlet />}>
          <Route index element={<PrincipalDashboard />} />
          <Route path="teachers" element={<PrincipalTeachers />} />
          <Route path="classes" element={<PrincipalClasses />} />
          <Route path="students" element={<PrincipalStudents />} />
          <Route path="analytics" element={<PrincipalAnalytics />} />
          <Route path="reports" element={<PrincipalReports />} />
          <Route path="events" element={<PrincipalEvents />} />
          <Route path="announcements" element={<PrincipalAnnouncements />} />
        </Route>

        <Route path="teacher" element={<Outlet />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="homework" element={<TeacherHomework />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="marks" element={<TeacherMarks />} />
          <Route path="results" element={<TeacherResults />} />
          <Route path="timetable" element={<TeacherTimetable />} />
          <Route path="notes" element={<TeacherNotes />} />
          <Route path="quizzes" element={<TeacherQuizzes />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="groups" element={<TeacherGroups />} />
          <Route path="groups/:id" element={<TeacherGroupDetail />} />
          <Route path="communication" element={<TeacherCommunication />} />
          <Route path="class-notices" element={<TeacherClassNotices />} />
        </Route>

        <Route path="student" element={<Outlet />}>
          <Route index element={<StudentDashboard />} />
          <Route path="homework" element={<StudentHomework />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="notes" element={<StudentNotes />} />
          <Route path="achievements" element={<StudentAchievements />} />
          <Route path="quizzes" element={<StudentQuizzes />} />
          <Route path="groups" element={<StudentGroups />} />
          <Route path="ai-assistant" element={<StudentAiAssistant />} />
          <Route path="study-planner" element={<StudentStudyPlanner />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="exam-schedule" element={<StudentExamSchedule />} />
        </Route>

        <Route path="parent" element={<Outlet />}>
          <Route index element={<ParentDashboard />} />
          <Route path="child-attendance" element={<ParentChildAttendance />} />
          <Route path="child-results" element={<ParentChildResults />} />
          <Route path="child-homework" element={<ParentChildHomework />} />
          <Route path="fees" element={<ParentFees />} />
          <Route path="notices" element={<ParentNotices />} />
          <Route path="communication" element={<ParentCommunication />} />
          <Route path="child-timetable" element={<ParentChildTimetable />} />
          <Route path="child-achievements" element={<ParentChildAchievements />} />
          <Route path="child-performance" element={<ParentChildPerformance />} />
        </Route>

        <Route path="community" element={<Outlet />}>
          <Route index element={<CommunityFeed />} />
          <Route path="feed" element={<CommunityFeed />} />
          <Route path="groups" element={<CommunityGroups />} />
          <Route path="groups/:groupId" element={<CommunityGroupDetail />} />
          <Route path="doubts" element={<CommunityDoubts />} />
          <Route path="achievement-wall" element={<CommunityAchievementWall />} />
        </Route>

        <Route path="chat" element={<Outlet />}>
          <Route index element={<ChatPage />} />
        </Route>

        <Route path="notifications" element={<Outlet />}>
          <Route index element={<NotificationsPage />} />
        </Route>

        <Route path="files" element={<Outlet />}>
          <Route index element={<FilesPage />} />
        </Route>

        <Route path="profile" element={<Outlet />}>
          <Route index element={<ProfilePage />} />
        </Route>

        <Route path="settings" element={<Outlet />}>
          <Route index element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
