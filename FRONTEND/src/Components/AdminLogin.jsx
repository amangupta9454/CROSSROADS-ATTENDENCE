import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

export default function AdminLogin() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [role, setRole] = useState('superadmin')

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        if (!form.email || !form.password) return toast.error('Enter email and password')
        setLoading(true)
        try {
            const res = await axios.post(`${API}/api/admin/login`, form)

            if (res.data.admin.role !== role) {
                setLoading(false)
                return toast.error(`Invalid credentials for ${role === 'superadmin' ? 'Super Admin' : 'Volunteer'}`)
            }

            localStorage.setItem('techfest_token', res.data.token)
            localStorage.setItem('techfest_admin', JSON.stringify(res.data.admin))
            toast.success(`Welcome back, ${role === 'superadmin' ? 'Admin' : 'Volunteer'}! 👋`)

            if (role === 'volunteer') {
                navigate('/volunteer/dashboard')
            } else {
                navigate('/admin/dashboard')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-login-spooky min-h-screen flex items-center justify-center p-4">
            {/* BG orbs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.12),transparent 70%)', filter: 'blur(50px)' }} />
                <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.1),transparent 70%)', filter: 'blur(50px)' }} />
            </div>

            <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <img 
                        src="/logo.png" 
                        alt="CodeArambh 2.0 Logo" 
                        className="animate-float-ghost"
                        style={{ width: '140px', height: 'auto', margin: '0 auto 1rem', display: 'block', filter: 'drop-shadow(0 0 15px rgba(249, 115, 22, 0.4))' }} 
                    />
                    <h1 className="spooky-title text-3xl font-extrabold mb-1">CodeArambh 2.0</h1>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Attendance Summon Portal</p>
                </div>

                {/* Card */}
                <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(249,115,22,0.25)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="input-label">Select Role</label>
                            <select
                                className="input"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ WebkitAppearance: 'none', appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}
                            >
                                <option value="superadmin" style={{ background: '#130c22', color: 'white' }}>Super Admin</option>
                                <option value="volunteer" style={{ background: '#130c22', color: 'white' }}>Volunteer</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Email Address</label>
                            <input
                                className="input"
                                name="email"
                                type="email"
                                placeholder="volunteer@fest.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="username"
                                autoFocus
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
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.1rem' }}
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '0.9rem', marginTop: '0.25rem' }}>
                            {loading
                                ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Summoning...</>
                                : '🧙 Enter Portal'}
                        </button>
                    </form>
                </div>



                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.75rem', marginTop: '1.5rem' }}>
                    DEVELOPED BY AMAN GUPTA · CODEARAMBH 2.0
                </p>
            </div>
        </div>
    )
}
