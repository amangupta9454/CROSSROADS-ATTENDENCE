import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL

export default function AudienceRegistration() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        role: 'Student',
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
        const { role, name, email, mobile, college, childName, address, designation, department } = form

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

        const mobileRegex = /^[6-9][0-9]{9}$/
        if (!mobileRegex.test(mobile)) {
            return toast.error('Please enter a valid 10-digit Indian mobile number')
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
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)', filter: 'blur(40px)' }} />
                </div>

                <div className="glass-md animate-fade-up" style={{
                    borderRadius: '1.75rem',
                    padding: 'clamp(2rem, 5vw, 2.5rem)',
                    textAlign: 'center',
                    maxWidth: '450px',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    <div style={{
                        fontSize: 'clamp(3rem, 8vw, 4rem)',
                        marginBottom: '1.25rem',
                        animation: 'bounce 0.6s ease-out'
                    }}>🎉</div>
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: 800,
                        color: '#10b981',
                        marginBottom: '0.75rem'
                    }}>You're In!</h1>
                    <p style={{
                        color: '#94a3b8',
                        marginBottom: '0.5rem',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                    }}>Welcome to <strong style={{ color: '#f1f5f9' }}>Crossroads 2026</strong></p>
                    <p style={{
                        color: '#64748b',
                        fontSize: 'clamp(0.8rem, 2.25vw, 0.9rem)',
                        marginBottom: '2rem',
                        lineHeight: 1.5
                    }}>Your attendance has been recorded automatically.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/scan')}
                        style={{
                            padding: 'clamp(0.75rem, 2.5vw, 0.95rem) clamp(1.5rem, 4vw, 2rem)',
                            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                            borderRadius: '0.75rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        Done 👋
                    </button>
                </div>

                <style jsx>{`
                    @keyframes bounce {
                        0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1) translateY(0); opacity: 1; }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="bg-gradient-main min-h-screen flex flex-col items-center justify-center p-4">
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            <div className="animate-fade-up" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '600px',
                marginTop: 'clamp(3rem, 8vh, 4rem)'
            }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate('/scan')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#94a3b8',
                        background: 'none',
                        border: 'none',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        marginBottom: 'clamp(1.25rem, 3vh, 1.75rem)',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.background = 'none';
                    }}
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                {/* Main Card */}
                <div className="glass-md" style={{
                    borderRadius: '1.75rem',
                    padding: 'clamp(1.75rem, 5vw, 2.5rem)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vh, 2rem)' }}>
                        <div style={{
                            fontSize: 'clamp(2.5rem, 6vw, 3rem)',
                            marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
                        }}>🎟️</div>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
                            fontWeight: 800,
                            marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
                            letterSpacing: '-0.5px'
                        }}>Audience Registration</h1>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                            fontWeight: 500
                        }}>Fill your details to enter Crossroads 2026</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vh, 1.25rem)' }}>
                        {/* Role Selection */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                                color: '#e2e8f0'
                            }}>I am a *</label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {['Student', 'Parents', 'Faculty'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, role: r }))}
                                        style={{
                                            flex: 1,
                                            padding: 'clamp(0.65rem, 2vw, 0.75rem)',
                                            borderRadius: '0.75rem',
                                            fontWeight: 600,
                                            fontSize: 'clamp(0.8rem, 2.25vw, 0.9rem)',
                                            border: form.role === r ? '1.5px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                                            background: form.role === r ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                                            color: form.role === r ? '#fff' : '#94a3b8',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseOver={e => {
                                            if (form.role !== r) {
                                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                            }
                                        }}
                                        onMouseOut={e => {
                                            if (form.role !== r) {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                            }
                                        }}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid Layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                            {/* Full Name */}
                            <div style={{ gridColumn: '1/-1' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                    fontWeight: 600,
                                    marginBottom: '0.375rem',
                                    color: '#e2e8f0'
                                }}>Full Name *</label>
                                <input
                                    className="input"
                                    name="name"
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                        fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                        borderRadius: '0.75rem'
                                    }}
                                />
                            </div>

                            {/* Child Name (Parents only) */}
                            {form.role === 'Parents' && (
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                        fontWeight: 600,
                                        marginBottom: '0.375rem',
                                        color: '#e2e8f0'
                                    }}>Child Name *</label>
                                    <input
                                        className="input"
                                        name="childName"
                                        placeholder="Enter your child's name"
                                        value={form.childName}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            borderRadius: '0.75rem'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                    fontWeight: 600,
                                    marginBottom: '0.375rem',
                                    color: '#e2e8f0'
                                }}>Email ID *</label>
                                <input
                                    className="input"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                        fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                        borderRadius: '0.75rem'
                                    }}
                                />
                            </div>

                            {/* Mobile */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                    fontWeight: 600,
                                    marginBottom: '0.375rem',
                                    color: '#e2e8f0'
                                }}>Mobile Number *</label>
                                <input
                                    className="input"
                                    name="mobile"
                                    placeholder="10-digit number"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                        fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                        borderRadius: '0.75rem'
                                    }}
                                />
                            </div>

                            {/* Student Fields */}
                            {form.role === 'Student' && (
                                <>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            fontWeight: 600,
                                            marginBottom: '0.375rem',
                                            color: '#e2e8f0'
                                        }}>College *</label>
                                        <input
                                            className="input"
                                            name="college"
                                            placeholder="Your college name"
                                            value={form.college}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                                fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                                borderRadius: '0.75rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            fontWeight: 600,
                                            marginBottom: '0.375rem',
                                            color: '#e2e8f0'
                                        }}>Branch</label>
                                        <input
                                            className="input"
                                            name="branch"
                                            placeholder="e.g. Computer Science"
                                            value={form.branch}
                                            onChange={handleChange}
                                            style={{
                                                padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                                fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                                borderRadius: '0.75rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            fontWeight: 600,
                                            marginBottom: '0.375rem',
                                            color: '#e2e8f0'
                                        }}>Course</label>
                                        <input
                                            className="input"
                                            name="course"
                                            placeholder="e.g. B.Tech, MBA"
                                            value={form.course}
                                            onChange={handleChange}
                                            style={{
                                                padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                                fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                                borderRadius: '0.75rem'
                                            }}
                                        />
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            fontWeight: 600,
                                            marginBottom: '0.375rem',
                                            color: '#e2e8f0'
                                        }}>Year</label>
                                        <select
                                            className="input"
                                            name="year"
                                            value={form.year}
                                            onChange={handleChange}
                                            style={{
                                                padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                                fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                                borderRadius: '0.75rem'
                                            }}
                                        >
                                            <option value="">Select Year</option>
                                            {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Parent Fields */}
                            {form.role === 'Parents' && (
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                        fontWeight: 600,
                                        marginBottom: '0.375rem',
                                        color: '#e2e8f0'
                                    }}>Complete Address *</label>
                                    <textarea
                                        className="input"
                                        name="address"
                                        placeholder="Enter your complete address"
                                        value={form.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        style={{
                                            padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            borderRadius: '0.75rem',
                                            resize: 'vertical',
                                            minHeight: '75px'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Faculty Fields */}
                            {form.role === 'Faculty' && (
                                <>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            fontWeight: 600,
                                            marginBottom: '0.375rem',
                                            color: '#e2e8f0'
                                        }}>Designation *</label>
                                        <select
                                            className="input"
                                            name="designation"
                                            value={form.designation}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                                fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                                borderRadius: '0.75rem'
                                            }}
                                        >
                                            <option value="">Select Designation</option>
                                            <option value="HOD">HOD</option>
                                            <option value="Faculty">Faculty</option>
                                            <option value="Institutional Head">Institutional Head</option>
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                            fontWeight: 600,
                                            marginBottom: '0.375rem',
                                            color: '#e2e8f0'
                                        }}>Department *</label>
                                        <select
                                            className="input"
                                            name="department"
                                            value={form.department}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                                                fontSize: 'clamp(0.85rem, 2.25vw, 0.95rem)',
                                                borderRadius: '0.75rem'
                                            }}
                                        >
                                            <option value="">Select Department</option>
                                            {['B.Tech CSE and allied', 'EE', 'ME', 'Polytechnic', 'BCA', 'MCA', 'BBA', 'MBA', 'B.Ed'].map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: 'clamp(0.85rem, 2.5vw, 1rem)',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                borderRadius: '0.75rem',
                                marginTop: 'clamp(0.5rem, 1.5vh, 0.75rem)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            onMouseOver={e => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)';
                                }
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: '#fff',
                                        borderRadius: '50%',
                                        animation: 'spin 0.6s linear infinite'
                                    }} />
                                    Registering...
                                </>
                            ) : '🎉 Register & Enter Crossroads'}
                        </button>
                    </form>
                </div>

                <p style={{
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                    marginTop: 'clamp(1.5rem, 3vh, 2rem)',
                    marginBottom: 'clamp(1rem, 2.5vh, 1.5rem)'
                }}>
                    Powered by CROSSROADS Attendance System
                </p>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
