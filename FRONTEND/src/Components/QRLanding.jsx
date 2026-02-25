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
                background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    gap: '1.5rem'
                }}>
                    {/* Left: Crossroads Logo + Name */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flex: '0 0 auto'
                    }}>
                        <Link to="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap'
                        }}>
                            <span style={{
                                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                fontWeight: 800,
                                color: '#fff'
                            }}>
                                CROSSROADS
                            </span>
                            <span style={{
                                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                                fontWeight: 700,
                                color: '#f59e0b'
                            }}>
                                2026
                            </span>
                        </Link>
                    </div>

                    {/* Center: HIET + Sunstone Logos */}
                    <div style={{
                        display: 'none',
                        alignItems: 'center',
                        gap: '1rem',
                        flex: '1 1 auto',
                        justifyContent: 'center'
                    }} className="logo-group">
                        <div style={{
                            width: 'clamp(45px, 8vw, 60px)',
                            height: 'clamp(45px, 8vw, 60px)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fff',
                            padding: '0.375rem',
                            boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
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
                            width: 'clamp(45px, 8vw, 60px)',
                            height: 'clamp(45px, 8vw, 60px)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fff',
                            padding: '0.375rem',
                            boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
                        }}>
                            <img
                                src="/sunstone.png"
                                alt="Sunstone Logo"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: Desktop Menu */}
                    <div style={{
                        display: 'none',
                        gap: '2rem',
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
                                padding: '0.5rem 1.25rem',
                                fontSize: '0.9rem',
                                borderRadius: '0.5rem',
                                whiteSpace: 'nowrap'
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
                            flex: '0 0 auto'
                        }}
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
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '0.5rem',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff',
                                padding: '0.375rem'
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
                                width: '50px',
                                height: '50px',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff',
                                padding: '0.375rem'
                            }}>
                                <img
                                    src="/sunstone.png"
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
                                fontWeight: 500
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
                maxWidth: '480px',
                marginTop: 'clamp(5rem, 15vh, 6rem)',
                padding: '0 1rem'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 'clamp(60px, 15vw, 72px)',
                        height: 'clamp(60px, 15vw, 72px)',
                        margin: '0 auto 1rem',
                        borderRadius: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        boxShadow: '0 8px 30px rgba(99,102,241,0.4)'
                    }}>🎓</div>
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.2,
                        marginBottom: '0.5rem'
                    }}>
                        CROSSROADS<span style={{ color: '#818cf8' }}> 2026</span>
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: 'clamp(0.85rem, 3vw, 1.1rem)',
                        marginBottom: '1rem'
                    }}>
                        Attendance Management System
                    </p>
                </div>

                {/* Card */}
                <div className="glass-md" style={{
                    borderRadius: '1.5rem',
                    padding: 'clamp(1.5rem, 4vw, 2rem)'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        Welcome! 👋
                    </h2>
                    <p style={{
                        color: '#94a3b8',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)'
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
                                padding: 'clamp(0.875rem, 3vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                borderRadius: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                            onClick={() => navigate('/scan/student')}
                        >
                            <span style={{ fontSize: 'clamp(1.2rem, 4vw, 1.4rem)' }}>✅</span>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                    Yes, I'm Registered
                                </div>
                                <div style={{
                                    fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                                    opacity: 0.8,
                                    fontWeight: 400
                                }}>
                                    I have a Student ID / Team Registration
                                </div>
                            </div>
                        </button>

                        {/* NO */}
                        <button
                            className="btn"
                            style={{
                                padding: 'clamp(0.875rem, 3vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                borderRadius: '0.875rem',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                            onClick={() => navigate('/scan/audience')}
                        >
                            <span style={{ fontSize: 'clamp(1.2rem, 4vw, 1.4rem)' }}>🎟️</span>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
                                    No, I'm Audience
                                </div>
                                <div style={{
                                    fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                                    opacity: 0.7,
                                    fontWeight: 400
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
                    fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                    marginTop: '1.5rem',
                    paddingBottom: '1rem'
                }}>
                    Powered by CROSSROADS Attendance System
                </p>
            </div>

            <style jsx>{`
                @media (min-width: 768px) {
                    .logo-group {
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
            `}</style>
        </div>
    )
}
