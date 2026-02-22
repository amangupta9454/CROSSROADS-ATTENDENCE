import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem('techfest_token')
    const admin = JSON.parse(localStorage.getItem('techfest_admin') || '{}')

    if (!token) return <Navigate to="/admin/login" replace />

    if (allowedRoles && !allowedRoles.includes(admin.role)) {
        if (admin.role === 'volunteer') return <Navigate to="/volunteer/dashboard" replace />
        if (admin.role === 'superadmin' || admin.role === 'admin') return <Navigate to="/admin/dashboard" replace />
        return <Navigate to="/admin/login" replace />
    }

    return children || <Outlet />
}
