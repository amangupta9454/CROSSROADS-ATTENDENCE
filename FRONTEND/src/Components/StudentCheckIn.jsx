import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

export default function StudentCheckIn() {
    const navigate = useNavigate()
    const [studentId, setStudentId] = useState('')
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [marking, setMarking] = useState(false)
    const [step, setStep] = useState('input') // 'input' | 'confirm' | 'done'

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!studentId.trim()) return
        setLoading(true)
        try {
            // Encode the ID and use /id/ prefix to avoid route conflicts with admin routes
            const res = await axios.get(`${API}/api/students/id/${encodeURIComponent(studentId.trim())}`)
            setStudent(res.data.student)
            setStep('confirm')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Student not found')
        } finally {
            setLoading(false)
        }
    }

    const handleMarkPresent = async () => {
        setMarking(true)
        try {
            await axios.patch(`${API}/api/students/id/${encodeURIComponent(student.studentId)}/present`)
            setStep('done')
            toast.success('Attendance marked! ✅')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error marking attendance')
        } finally {
            setMarking(false)
        }
    }

    return (
        <div className="bg-gradient-main min-h-screen flex items-center justify-center p-4">
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '520px' }}>

                {/* Back */}
                <button className="btn btn-ghost" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/scan')}>
                    ← Back
                </button>

                {/* Step: Input */}
                {step === 'input' && (
                    <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎫</div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Student Check-In</h1>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enter your Student ID to verify registration</p>
                        </div>
                        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="input-label">Student ID</label>
                                <input
                                    className="input"
                                    placeholder="e.g. TF2025-001"
                                    value={studentId}
                                    onChange={e => setStudentId(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '0.85rem' }}>
                                {loading ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Searching...</> : '🔍 Find My Registration'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step: Confirm */}
                {step === 'confirm' && student && (
                    <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Registration Details</h1>
                        </div>

                        {student.isPresent && (
                            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#fbbf24', fontSize: '0.875rem', textAlign: 'center' }}>
                                ⚠️ Attendance already marked at {new Date(student.presentAt).toLocaleString('en-IN')}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {[
                                ['Student ID', student.studentId],
                                ['Team Name', student.teamName],
                                ['Team Leader', student.teamLeaderName],
                                ['Event', student.eventName],
                                ['College', student.college],
                                ['Branch', student.branch],
                                ['Year', student.year],
                                ['Team Size', student.teamSize],
                                ['Mobile', student.leaderMobile],
                                ['Email', student.leaderEmail],
                            ].map(([label, val]) => (
                                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.6rem', padding: '0.6rem 0.8rem' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, wordBreak: 'break-all' }}>{val || '-'}</div>
                                </div>
                            ))}
                        </div>

                        {student.teamMembers?.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Team Members</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {student.teamMembers.map((m, i) => (
                                        <span key={i} className="badge badge-purple">{m}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setStep('input'); setStudent(null) }}>
                                ← Back
                            </button>
                            {!student.isPresent && (
                                <button className="btn btn-success" style={{ flex: 2, padding: '0.85rem' }} onClick={handleMarkPresent} disabled={marking}>
                                    {marking ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Marking...</> : '✅ Mark Present'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Step: Done */}
                {step === 'done' && (
                    <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#10b981' }}>Attendance Marked!</h1>
                        <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Welcome to <strong>Crossroads 2026</strong></p>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>
                            {student?.teamName} — {student?.eventName}
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/scan')} style={{ padding: '0.85rem 2rem' }}>
                            Done 👋
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
