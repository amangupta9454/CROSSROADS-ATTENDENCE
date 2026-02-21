import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

const StatCard = ({ icon, label, value, gradient, sub }) => (
    <div className="stat-card animate-fade-up" style={{ background: gradient, border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>{icon}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' }}>{sub}</div>
        </div>
        <div style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.35rem' }}>{value ?? '—'}</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 500 }}>{label}</div>
    </div>
)

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('techfest_token')

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${API}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setStats(res.data)
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load stats')
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const attendance = stats
        ? stats.totalStudents > 0
            ? Math.round((stats.presentStudents / stats.totalStudents) * 100)
            : 0
        : 0

    return (
        <div className="page-enter">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Dashboard 📊</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Live overview of Crossroads 2026 attendance</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
                    <div className="spinner" style={{ width: '3rem', height: '3rem' }} />
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                        <StatCard icon="🎓" label="Total Registered" value={stats?.totalStudents} sub="Students" gradient="linear-gradient(135deg,rgba(99,102,241,0.25),rgba(99,102,241,0.05))" />
                        <StatCard icon="✅" label="Present Today" value={stats?.presentStudents} sub="Checked In" gradient="linear-gradient(135deg,rgba(16,185,129,0.25),rgba(16,185,129,0.05))" />
                        <StatCard icon="❌" label="Yet to Arrive" value={stats?.absentStudents} sub="Absent" gradient="linear-gradient(135deg,rgba(239,68,68,0.22),rgba(239,68,68,0.04))" />
                        <StatCard icon="🎟️" label="Audience Count" value={stats?.audienceCount} sub="Walk-ins" gradient="linear-gradient(135deg,rgba(245,158,11,0.22),rgba(245,158,11,0.04))" />
                    </div>

                    {/* Attendance progress bar */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Attendance Rate</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{stats?.presentStudents} of {stats?.totalStudents} students checked in</div>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{attendance}%</div>
                        </div>
                        <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ width: `${attendance}%`, height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg,#6366f1,#10b981)', transition: 'width 1s ease' }} />
                        </div>
                    </div>

                    {/* Quick overview */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
                        <div className="card">
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Stats</h3>
                            {[
                                ['Registered Participants', stats?.totalStudents, '#818cf8'],
                                ['Present', stats?.presentStudents, '#10b981'],
                                ['Absent', stats?.absentStudents, '#ef4444'],
                                ['Audience Members', stats?.audienceCount, '#f59e0b'],
                            ].map(([label, val, color]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{label}</span>
                                    <span style={{ fontWeight: 700, color, fontSize: '1.05rem' }}>{val ?? 0}</span>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    { label: 'View All Students', href: '/admin/students', icon: '🎓' },
                                    { label: 'Present Students', href: '/admin/present', icon: '✅' },
                                    { label: 'Audience List', href: '/admin/audience', icon: '🎟️' },
                                    { label: 'Add Student', href: '/admin/add-student', icon: '➕' },
                                ].map(a => (
                                    <a key={a.href} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.04)', color: '#f1f5f9', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                                        <span>{a.icon}</span>{a.label}
                                        <span style={{ marginLeft: 'auto', color: '#4b5563' }}>→</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
