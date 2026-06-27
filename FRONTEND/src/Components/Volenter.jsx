import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

const navLinks = [
    { to: '/volunteer/dashboard', label: 'Dashboard', icon: '🎃' },
    { to: '/volunteer/team-attendance', label: 'Team Attendance', icon: '🧟' },
    { to: '/volunteer/students', label: 'Registered Students', icon: '💀' },
    { to: '/volunteer/present', label: 'Present Students', icon: '🧛' },
]

export default function Volenter() {
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

    return (
        <div className="bg-dashboard-spooky" style={{ display: 'flex' }}>
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img 
                            src="/logo.png" 
                            alt="CodeArambh 2.0 Logo" 
                            style={{ width: '42px', height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.4))' }} 
                        />
                        <div>
                            <div className="spooky-title" style={{ fontSize: '0.9rem', lineHeight: 1.1, fontWeight: 900 }}>CodeArambh 2.0</div>
                            <div style={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 800, letterSpacing: '0.05em', marginTop: '1px' }}>VOLUNTEER PANEL</div>
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
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid rgba(249,115,22,0.1)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Logged in as</div>
                        <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 700, wordBreak: 'break-all' }}>Volunteer ({admin.email})</div>
                    </div>
                    <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(249,115,22,0.2)' }} onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 49, backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="main-content" style={{ flex: 1, padding: '0', display: 'flex', flexDirection: 'column' }}>
                {/* Mobile Header */}
                <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(19, 12, 34, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(249, 115, 22, 0.15)', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 40 }}
                    className="mobile-header">
                    <button className="btn btn-ghost" onClick={() => setSidebarOpen(true)} style={{ padding: '0.4rem 0.75rem', borderColor: 'rgba(249,115,22,0.2)' }}>☰</button>
                    <span className="spooky-title" style={{ fontWeight: 800, fontSize: '1.1rem' }}>CodeArambh 2.0</span>
                </div>

                <div className="content-wrapper" style={{ flex: 1 }}>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
