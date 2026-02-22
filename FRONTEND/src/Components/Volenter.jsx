import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// Import Dashboard Components
import Dashboard from './Dashboard'
import RegisteredStudents from './RegisteredStudents'
import PresentStudents from './PresentStudents'
import AudienceList from './AudienceList'
import AddStudent from './AddStudent'

const API = import.meta.env.VITE_BACKEND_URL

// Credentials from frontend environment variables
const VOLUNTEER_EMAIL = import.meta.env.VITE_VOLUNTEER_EMAIL || "guptaaman8574@gmail.com"
const VOLUNTEER_PASSWORD = import.meta.env.VITE_VOLUNTEER_PASSWORD || "Aman@2005"

const ADMIN_EMAIL = import.meta.env.VITE_BACKEND_ADMIN_EMAIL
const ADMIN_PASSWORD = import.meta.env.VITE_BACKEND_ADMIN_PASSWORD

const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Registered Students', icon: '🎓' },
    { id: 'present', label: 'Present Students', icon: '✅' },
    { id: 'audience', label: 'Audience', icon: '🎟️' },
    { id: 'add-student', label: 'Add Student', icon: '➕' },
]

export default function Volenter() {
    const navigate = useNavigate()

    // State for Login
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    // State for Dashboard Layout
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')

    // Check if volunteer is already logged in (using a simple local storage flag)
    useEffect(() => {
        if (localStorage.getItem('techfest_volunteer_token')) {
            setIsLoggedIn(true)
        }
    }, [])

    const handleLoginChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleLoginSubmit = async e => {
        e.preventDefault()
        if (!form.email || !form.password) return toast.error('Enter email and password')

        setLoading(true)

        // 1. Validate Volunteer Credentials Locally
        if (form.email === VOLUNTEER_EMAIL && form.password === VOLUNTEER_PASSWORD) {
            try {
                // 2. Perform Silent Backend Admin Login to get token
                const res = await axios.post(`${API}/api/admin/login`, {
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD
                })

                // 3. Store the token for API calls
                localStorage.setItem('techfest_token', res.data.token)
                // Store a flag indicating volunteer is logged in
                localStorage.setItem('techfest_volunteer_token', 'true')

                toast.success('Welcome Volunteer! 👋')
                setIsLoggedIn(true)
            } catch (err) {
                console.error("Silent admin login failed", err)
                toast.error('Could not authenticate with backend. Please contact support.')
            } finally {
                setLoading(false)
            }
        } else {
            toast.error('Invalid Volunteer Credentials')
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('techfest_token')
        localStorage.removeItem('techfest_volunteer_token')
        toast.success('Logged out successfully')
        setIsLoggedIn(false)
        setForm({ email: '', password: '' })
    }

    const navLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.7rem 1rem',
        borderRadius: '0.6rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        textDecoration: 'none',
        color: isActive ? '#f1f5f9' : '#94a3b8',
        background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent', // Greenish theme for volunteer
        borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
        transition: 'all 0.15s',
        marginBottom: '0.25rem',
        cursor: 'pointer'
    })

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />
            case 'students': return <RegisteredStudents />
            case 'present': return <PresentStudents />
            case 'audience': return <AudienceList />
            case 'add-student': return <AddStudent />
            default: return <Dashboard />
        }
    }

    const Sidebar = () => (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                        🤝
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>CROSSROADS 2026</div>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>VOLUNTEER PANEL</div>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
                {navLinks.map(link => (
                    <div
                        key={link.id}
                        style={navLinkStyle(activeTab === link.id)}
                        onClick={() => {
                            setActiveTab(link.id)
                            setSidebarOpen(false)
                        }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                        <span>{link.label}</span>
                    </div>
                ))}
            </nav>

            {/* Volunteer Info + Logout */}
            <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Logged in as</div>
                    <div style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600, wordBreak: 'break-all' }}>{VOLUNTEER_EMAIL}</div>
                </div>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#ef4444' }} onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </aside>
    )

    // Render Login Form if NOT logged in
    if (!isLoggedIn) {
        return (
            <div className="bg-gradient-main min-h-screen flex items-center justify-center p-4">
                {/* BG orbs - using greenish tints for volunteer */}
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                    <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.2),transparent 70%)', filter: 'blur(50px)' }} />
                    <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(5,150,105,0.15),transparent 70%)', filter: 'blur(50px)' }} />
                </div>

                <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}>
                            🤝
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Volunteer Login</h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>CROSSROADS Attendance:- Volunteer Access</p>
                    </div>

                    {/* Card */}
                    <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="input-label">Volunteer Email</label>
                                <input
                                    className="input"
                                    name="email"
                                    type="email"
                                    placeholder="volunteer@fest.com"
                                    value={form.email}
                                    onChange={handleLoginChange}
                                    autoComplete="username"
                                    autoFocus
                                    style={{ borderColor: 'rgba(16,185,129,0.3)' }}
                                />
                            </div>
                            <div>
                                <label className="input-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="input"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleLoginChange}
                                        autoComplete="current-password"
                                        style={{ paddingRight: '3rem', borderColor: 'rgba(16,185,129,0.3)' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem' }}
                                    >
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '0.9rem', marginTop: '0.25rem', background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                                {loading
                                    ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Signing in...</>
                                    : '🤝 Sign In'}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                        POWERED BY CROSSROADS 2026
                    </p>
                </div>
            </div>
        )
    }

    // Render Dashboard if logged in
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
                <div style={{ display: 'flex', padding: '1rem 1.25rem', background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 40 }}
                    className="mobile-header md:hidden">
                    <button className="btn btn-ghost" onClick={() => setSidebarOpen(true)} style={{ padding: '0.5rem 0.75rem' }}>☰</button>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>Volunteer Panel</span>
                </div>

                <div style={{ padding: '2rem', minHeight: '100vh' }}>
                    {renderActiveTab()}
                </div>
            </main>
        </div>
    )
}
