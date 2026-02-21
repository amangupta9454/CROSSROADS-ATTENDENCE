import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/students', label: 'Registered Students', icon: '🎓' },
    { to: '/admin/present', label: 'Present Students', icon: '✅' },
    { to: '/admin/audience', label: 'Audience', icon: '🎟️' },
    { to: '/admin/add-student', label: 'Add Student', icon: '➕' },
]

export default function AdminLayout() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const admin = JSON.parse(localStorage.getItem('techfest_admin') || '{}')

    const handleLogout = () => {
        localStorage.removeItem('techfest_token')
        localStorage.removeItem('techfest_admin')
        toast.success('Logged out successfully')
        navigate('/admin/login')
    }

    const navLinkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.7rem 1rem',
        borderRadius: '0.6rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        textDecoration: 'none',
        color: isActive ? '#f1f5f9' : '#94a3b8',
        background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
        borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
        transition: 'all 0.15s',
        marginBottom: '0.25rem',
    })

    const Sidebar = () => (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                        🎓
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>TechFest</div>
                        <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600 }}>ADMIN PANEL</div>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
                {navLinks.map(link => (
                    <NavLink key={link.to} to={link.to} style={navLinkStyle} onClick={() => setSidebarOpen(false)}>
                        <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Admin Info + Logout */}
            <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Logged in as</div>
                    <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, wordBreak: 'break-all' }}>{admin.email || 'admin'}</div>
                </div>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </aside>
    )

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>
            {/* Desktop Sidebar */}
            <div style={{ display: 'block' }}>
                <Sidebar />
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49 }} onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="main-content" style={{ flex: 1, padding: '0' }}>
                {/* Mobile Header */}
                <div style={{ display: 'none', padding: '1rem 1.25rem', background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 40 }}
                    className="mobile-header">
                    <button className="btn btn-ghost" onClick={() => setSidebarOpen(true)} style={{ padding: '0.5rem 0.75rem' }}>☰</button>
                    <span style={{ fontWeight: 700 }}>TechFest Admin</span>
                </div>

                <div style={{ padding: '2rem', minHeight: '100vh' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
