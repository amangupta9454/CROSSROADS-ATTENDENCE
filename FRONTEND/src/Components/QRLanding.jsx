import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function QRLanding() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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

            {/* Navbar */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
                display: 'flex', flexDirection: 'column',
                background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    maxWidth: '1400px',
                    width: '100%',
                    margin: '0 auto'
                }}>
                    {/* Left: Crossroads Logo + Name + Logos */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flex: '1 1 auto'
                    }}>
                        <Link to="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap'
                        }}>
                            <span style={{
                                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                                fontWeight: 800,
                                color: '#fff',
                                letterSpacing: '0.5px'
                            }}>
                                CROSSROADS
                            </span>
                            <span style={{
                                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                                fontWeight: 700,
                                color: '#f59e0b'
                            }}>
                                2026
                            </span>
                        </Link>
                        
                        {/* Logos - shown on desktop */}
                        <div style={{
                            display: 'none',
                            alignItems: 'center',
                            gap: '0.625rem',
                            marginLeft: '0.75rem',
                            paddingLeft: '0.75rem',
                            borderLeft: '1px solid rgba(255,255,255,0.15)'
                        }} className="desktop-logos">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff',
                                padding: '0.25rem',
                                boxShadow: '0 2px 8px rgba(99,102,241,0.2)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.2)';
                            }}
                            >
                                <img
                                    src="/hiet.png"
                                    alt="HIET Logo"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff',
                                padding: '0.25rem',
                                boxShadow: '0 2px 8px rgba(99,102,241,0.2)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.2)';
                            }}
                            >
                                <img
                                    src="/sunstone.jpg"
                                    alt="Sunstone Logo"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Desktop Menu */}
                    <div style={{
                        display: 'none',
                        gap: '1.5rem',
                        alignItems: 'center',
                        flex: '0 0 auto'
                    }} className="desktop-menu">
                        <Link
                            to="/"
                            style={{
                                color: '#cbd5e1',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                transition: 'color 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={e => e.target.style.color = '#fff'}
                            onMouseOut={e => e.target.style.color = '#cbd5e1'}
                        >
                            Home
                        </Link>
                        <Link
                            to="/admin/login"
                            className="btn btn-primary"
                            style={{
                                padding: '0.625rem 1.25rem',
                                fontSize: '0.9rem',
                                borderRadius: '0.5rem',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#fff',
                            padding: '0.25rem',
                            display: 'none',
                            flex: '0 0 auto',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.target.style.transform = 'scale(1)'}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div
                        className="mobile-menu"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            padding: '1rem 1.5rem',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            animation: 'slideDown 0.2s ease-out'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.5rem',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff',
                                padding: '0.25rem',
                                boxShadow: '0 2px 8px rgba(99,102,241,0.2)'
                            }}>
                                <img
                                    src="/hiet.png"
                                    alt="HIET Logo"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff',
                                padding: '0.25rem',
                                boxShadow: '0 2px 8px rgba(99,102,241,0.2)'
                            }}>
                                <img
                                    src="/sunstone.jpg"
                                    alt="Sunstone Logo"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        </div>
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                color: '#cbd5e1',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                padding: '0.5rem',
                                borderRadius: '0.375rem',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={e => {
                                e.target.style.background = 'rgba(255,255,255,0.05)';
                                e.target.style.color = '#fff';
                            }}
                            onMouseOut={e => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#cbd5e1';
                            }}
                        >
                            Home
                        </Link>
                        <Link
                            to="/admin/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="btn btn-primary"
                            style={{
                                padding: '0.75rem',
                                fontSize: '1rem',
                                borderRadius: '0.5rem',
                                textAlign: 'center'
                            }}
                        >
                            Login
                        </Link>
                    </div>
                )}
            </nav>

            <div className="animate-fade-up" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '500px',
                marginTop: 'clamp(6rem, 20vh, 8rem)',
                padding: '0 1rem'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 'clamp(64px, 15vw, 80px)',
                        height: 'clamp(64px, 15vw, 80px)',
                        margin: '0 auto 1.25rem',
                        borderRadius: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        boxShadow: '0 12px 40px rgba(99,102,241,0.4)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>🎓</div>
                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                        fontWeight: 800,
                        lineHeight: 1.2,
                        marginBottom: '0.75rem',
                        letterSpacing: '-0.5px'
                    }}>
                        CROSSROADS<span style={{ color: '#818cf8' }}> 2026</span>
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: 'clamp(0.95rem, 3vw, 1.125rem)',
                        marginBottom: '1rem',
                        fontWeight: 500
                    }}>
                        Attendance Management System
                    </p>
                </div>

                {/* Card */}
                <div className="glass-md" style={{
                    borderRadius: '1.75rem',
                    padding: 'clamp(1.75rem, 5vw, 2.5rem)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '0.75rem'
                    }}>
                        Welcome! 👋
                    </h2>
                    <p style={{
                        color: '#94a3b8',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        fontSize: 'clamp(0.9rem, 2.75vw, 1rem)',
                        lineHeight: 1.6
                    }}>
                        Are you registered for any event at CROSSROADS?
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {/* YES */}
                        <button
                            className="btn btn-primary animate-pulse-glow"
                            style={{
                                padding: 'clamp(1rem, 3.5vw, 1.25rem) clamp(1.25rem, 4vw, 1.75rem)',
                                fontSize: 'clamp(0.95rem, 2.75vw, 1.05rem)',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onClick={() => navigate('/scan/student')}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <span style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.6rem)' }}>✅</span>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.95rem, 2.75vw, 1.05rem)' }}>
                                    Yes, I'm Registered
                                </div>
                                <div style={{
                                    fontSize: 'clamp(0.8rem, 2.25vw, 0.875rem)',
                                    opacity: 0.85,
                                    fontWeight: 400,
                                    marginTop: '0.125rem'
                                }}>
                                    I have a Team ID / Team Registration
                                </div>
                            </div>
                        </button>

                        {/* NO */}
                        <button
                            className="btn"
                            style={{
                                padding: 'clamp(1rem, 3.5vw, 1.25rem) clamp(1.25rem, 4vw, 1.75rem)',
                                fontSize: 'clamp(0.95rem, 2.75vw, 1.05rem)',
                                borderRadius: '1rem',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => navigate('/scan/audience')}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <span style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.6rem)' }}>🎟️</span>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.95rem, 2.75vw, 1.05rem)' }}>
                                    No, I'm Audience
                                </div>
                                <div style={{
                                    fontSize: 'clamp(0.8rem, 2.25vw, 0.875rem)',
                                    opacity: 0.75,
                                    fontWeight: 400,
                                    marginTop: '0.125rem'
                                }}>
                                    Register as an audience member
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <p style={{
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: 'clamp(0.8rem, 2.25vw, 0.875rem)',
                    marginTop: '1.75rem',
                    paddingBottom: '2rem'
                }}>
                    Powered by CROSSROADS Attendance System
                </p>
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                @media (min-width: 768px) {
                    .desktop-logos {
                        display: flex !important;
                    }
                    .desktop-menu {
                        display: flex !important;
                    }
                }
                
                @media (max-width: 767px) {
                    .mobile-menu-btn {
                        display: block !important;
                    }
                }

                @media (max-width: 480px) {
                    nav > div:first-child {
                        padding: 0.875rem 1rem;
                    }
                }
            `}</style>
        </div>
    )
}
