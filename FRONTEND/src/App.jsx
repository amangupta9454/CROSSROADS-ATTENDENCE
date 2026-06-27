import { Routes, Route, Navigate } from 'react-router-dom'

// Admin auth
import AdminLogin from './Components/AdminLogin'
import ProtectedRoute from './Components/ProtectedRoute'

// Dashboard Layouts
import AdminLayout from './Components/AdminLayout'
import Volenter from './Components/Volenter'
import Dashboard from './Components/Dashboard'
import RegisteredStudents from './Components/RegisteredStudents'
import PresentStudents from './Components/PresentStudents'
import TeamAttendance from './Components/TeamAttendance'

export default function App() {
  return (
    <Routes>
      {/* Root path directly renders Admin/Volunteer Login */}
      <Route path="/" element={<AdminLogin />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Dashboard (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="team-attendance" element={<TeamAttendance />} />
        <Route path="students" element={<RegisteredStudents />} />
        <Route path="present" element={<PresentStudents />} />
      </Route>

      {/* Volunteer Dashboard (protected) */}
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <Volenter />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/volunteer/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="team-attendance" element={<TeamAttendance />} />
        <Route path="students" element={<RegisteredStudents />} />
        <Route path="present" element={<PresentStudents />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}