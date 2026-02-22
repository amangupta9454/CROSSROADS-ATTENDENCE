import { Routes, Route, Navigate } from 'react-router-dom'

// User-facing QR scan flow
import QRLanding from './Components/QRLanding'
import StudentCheckIn from './Components/StudentCheckIn'
import AudienceRegistration from './Components/AudienceRegistration'

// Admin auth
import AdminLogin from './Components/AdminLogin'
import ProtectedRoute from './Components/ProtectedRoute'

// Admin dashboard
import AdminLayout from './Components/AdminLayout'
import Dashboard from './Components/Dashboard'
import Volenter from './Components/Volenter'
import RegisteredStudents from './Components/RegisteredStudents'
import PresentStudents from './Components/PresentStudents'
import AudienceList from './Components/AudienceList'
import AddStudent from './Components/AddStudent'

export default function App() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/scan" replace />} />

      {/* QR Scan Flow (public) */}
      <Route path="/scan" element={<QRLanding />} />
      <Route path="/scan/student" element={<StudentCheckIn />} />
      <Route path="/scan/audience" element={<AudienceRegistration />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Volunteer View */}
      <Route path="/volunteer" element={<Volenter />} />

      {/* Admin Dashboard (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<RegisteredStudents />} />
        <Route path="present" element={<PresentStudents />} />
        <Route path="audience" element={<AudienceList />} />
        <Route path="add-student" element={<AddStudent />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/scan" replace />} />
    </Routes>
  )
}