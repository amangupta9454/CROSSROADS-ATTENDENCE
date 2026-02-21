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

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        if (!form.email || !form.password) return toast.error('Enter email and password')
        setLoading(true)
        try {
            const res = await axios.post(`${API}/api/admin/login`, form)
            localStorage.setItem('techfest_token', res.data.token)
            localStorage.setItem('techfest_admin', JSON.stringify(res.data.admin))
            toast.success('Welcome back! 👋')
            navigate('/admin/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gradient-main min-h-screen flex items-center justify-center p-4">
            {/* BG orbs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)', filter: 'blur(50px)' }} />
                <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)', filter: 'blur(50px)' }} />
            </div>

            <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}>
                        🔐
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Admin Login</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>TechFest Attendance — Secure Dashboard</p>
                </div>

                {/* Card */}
                <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="input-label">Admin Email</label>
                            <input
                                className="input"
                                name="email"
                                type="email"
                                placeholder="admin@fest.com"
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
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem' }}
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '0.9rem', marginTop: '0.25rem' }}>
                            {loading
                                ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Signing in...</>
                                : '🔐 Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                    Protected by JWT · TechFest 2025
                </p>
            </div>
        </div>
    )
}
