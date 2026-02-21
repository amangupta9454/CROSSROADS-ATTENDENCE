import { useNavigate } from 'react-router-dom'

export default function QRLanding() {
    const navigate = useNavigate()

    return (
        <div className="bg-gradient-main min-h-screen flex items-center justify-center p-4">
            {/* Animated background orbs */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0
            }}>
                <div style={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vw',
                    borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)',
                    filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw',
                    borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)',
                    filter: 'blur(40px)'
                }} />
            </div>

            <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '72px', height: '72px', margin: '0 auto 1rem',
                        borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        boxShadow: '0 8px 30px rgba(99,102,241,0.4)'
                    }}>🎓</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>
                        CROSSROADS<span style={{ color: '#818cf8' }}> 2026</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                        Attendance Management System
                    </p>
                </div>

                {/* Card */}
                <div className="glass-md" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
                        Welcome! 👋
                    </h2>
                    <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
                        Are you registered for any event at CROSSROADS?
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* YES */}
                        <button
                            className="btn btn-primary animate-pulse-glow"
                            style={{ padding: '1rem 1.5rem', fontSize: '1rem', borderRadius: '0.875rem' }}
                            onClick={() => navigate('/scan/student')}
                        >
                            <span style={{ fontSize: '1.4rem' }}>✅</span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 700 }}>Yes, I'm Registered</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 400 }}>I have a Student ID / Team Registration</div>
                            </div>
                        </button>

                        {/* NO */}
                        <button
                            className="btn"
                            style={{
                                padding: '1rem 1.5rem', fontSize: '1rem', borderRadius: '0.875rem',
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                                color: '#f1f5f9'
                            }}
                            onClick={() => navigate('/scan/audience')}
                        >
                            <span style={{ fontSize: '1.4rem' }}>🎟️</span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 700 }}>No, I'm Audience</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 400 }}>Register as an audience member</div>
                            </div>
                        </button>
                    </div>
                </div>

                <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                    Powered by CROSSROADS Attendance System
                </p>
            </div>
        </div>
    )
}
