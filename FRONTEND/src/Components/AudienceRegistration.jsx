import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

export default function AudienceRegistration() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        role: 'Student', // Default
        name: '', email: '', mobile: '',
        college: '', branch: '', course: '', year: '',
        childName: '', address: '',
        designation: '', department: ''
    })
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        const { role, name, email, mobile, college, childName, address, designation, department } = form;

        if (!role || !name || !email || !mobile) {
            return toast.error('Please fill all required base fields')
        }

        if (role === 'Student' && !college) {
            return toast.error('College is required for Students')
        }
        if (role === 'Parents' && (!childName || !address)) {
            return toast.error('Child name and address are required for Parents')
        }
        if (role === 'Faculty' && (!designation || !department)) {
            return toast.error('Designation and department are required for Faculty')
        }

        const mobileRegex = /^[6-9][0-9]{9}$/;
        if (!mobileRegex.test(mobile)) {
            return toast.error('Please enter a valid 10-digit Indian mobile number');
        }

        setLoading(true)
        try {
            await axios.post(`${API}/api/audience`, form)
            setDone(true)
            toast.success('Registered successfully! 🎉')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    if (done) {
        return (
            <div className="bg-gradient-main min-h-screen flex items-center justify-center p-4">
                <div className="glass-md animate-fade-up" style={{ borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>You're In!</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Welcome to <strong style={{ color: '#f1f5f9' }}>Crossroads 2026</strong></p>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '2rem' }}>Your attendance has been recorded automatically.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/scan')} style={{ padding: '0.85rem 2rem' }}>
                        Done 👋
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-main min-h-screen flex items-center justify-center p-4">
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '540px' }}>
                <button className="btn btn-ghost" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/scan')}>← Back</button>

                <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎟️</div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Audience Registration</h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Fill your details to enter Crossroads 2026</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div style={{ gridColumn: '1/-1' }}>
                                <label className="input-label">I am a *</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                                    {['Student', 'Parents', 'Faculty'].map(r => (
                                        <button
                                            key={r} type="button"
                                            onClick={() => setForm(f => ({ ...f, role: r }))}
                                            style={{
                                                flex: 1, padding: '0.65rem', borderRadius: '0.6rem', fontWeight: 600, fontSize: '0.9rem',
                                                border: form.role === r ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                                                background: form.role === r ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                                                color: form.role === r ? '#fff' : '#94a3b8',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ gridColumn: '1/-1' }}>
                                <label className="input-label">Full Name *</label>
                                <input className="input" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                            </div>

                            {form.role === 'Parents' && (
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label className="input-label">Child Name *</label>
                                    <input className="input" name="childName" placeholder="Enter your child name" value={form.childName} onChange={handleChange} required />
                                </div>
                            )}

                            <div>
                                <label className="input-label">Email Id *</label>
                                <input className="input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="input-label">Mobile Number *</label>
                                <input className="input" name="mobile" placeholder="10-digit number" value={form.mobile} onChange={handleChange} required />
                            </div>

                            {form.role === 'Student' && (
                                <>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label className="input-label">College *</label>
                                        <input className="input" name="college" placeholder="Your college name" value={form.college} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label className="input-label">Branch</label>
                                        <input className="input" name="branch" placeholder="e.g. Computer Science" value={form.branch} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="input-label">Course</label>
                                        <input className="input" name="course" placeholder="e.g. B.Tech, MBA" value={form.course} onChange={handleChange} />
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label className="input-label">Year</label>
                                        <select className="input" name="year" value={form.year} onChange={handleChange}>
                                            <option value="" >Select Year</option>
                                            {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                                                <option key={y} value={y} className="bg-gray-500">{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {form.role === 'Parents' && (
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label className="input-label">Complete Address *</label>
                                    <textarea className="input" name="address" placeholder="Enter your complete address" value={form.address} onChange={handleChange} required rows={3} style={{ resize: 'vertical' }} />
                                </div>
                            )}

                            {form.role === 'Faculty' && (
                                <>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label className="input-label">Designation *</label>
                                        <select className="input" name="designation" value={form.designation} onChange={handleChange} required>
                                            <option value="">Select Designation</option>
                                            <option value="HOD" className="bg-gray-500">HOD</option>
                                            <option value="Faculty" className="bg-gray-500">Faculty</option>
                                            <option value="Institutional Head" className="bg-gray-500">Institutional Head</option>
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label className="input-label">Department *</label>
                                        <select className="input" name="department" value={form.department} onChange={handleChange} required>
                                            <option value="">Select Department</option>
                                            {[
                                                'B.Tech CSE and allied', 'EE', 'ME', 'Polytechnic',
                                                'BCA', 'MCA', 'BBA', 'MBA', 'B.Ed'
                                            ].map(dept => (
                                                <option key={dept} value={dept} className="bg-gray-500">{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '0.9rem', marginTop: '0.5rem' }}>
                            {loading
                                ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Registering...</>
                                : '🎉 Register & Enter Crossroads'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
