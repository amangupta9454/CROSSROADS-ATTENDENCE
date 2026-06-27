import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

export default function TeamAttendance() {
    const [teamIdInput, setTeamIdInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [teamData, setTeamData] = useState(null)
    const [selectedTemplate, setSelectedTemplate] = useState('pumpkin') // 'pumpkin' | 'dracula' | 'witch'
    const [timeStr, setTimeStr] = useState('')
    
    const token = localStorage.getItem('techfest_token')

    // Bubbles for Witch's Cauldron template
    const [bubbles, setBubbles] = useState([])

    useEffect(() => {
        if (selectedTemplate === 'witch') {
            const interval = setInterval(() => {
                setBubbles(prev => [
                    ...prev.slice(-15), // keep last 15 bubbles max
                    {
                        id: Math.random(),
                        left: Math.random() * 100,
                        size: Math.random() * 20 + 10,
                        duration: Math.random() * 3 + 3
                    }
                ])
            }, 600);
            return () => clearInterval(interval);
        } else {
            setBubbles([])
        }
    }, [selectedTemplate])

    // Countdown Timer logic
    useEffect(() => {
        if (!teamData || !teamData.attendanceMarkedAt || teamData.isLocked) {
            setTimeStr('')
            return
        }

        const markTime = new Date(teamData.attendanceMarkedAt).getTime()
        const lockTime = markTime + 4 * 60 * 60 * 1000

        const updateTimer = () => {
            const now = Date.now()
            const diff = lockTime - now

            if (diff <= 0) {
                setTeamData(prev => ({ ...prev, isLocked: true }))
                setTimeStr('LOCKED')
                toast.error('Attendance has been locked (4 hours window expired).')
                return false
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            const pad = (n) => String(n).padStart(2, '0')
            setTimeStr(`${pad(hours)}h:${pad(minutes)}m:${pad(seconds)}s remaining`)
            return true
        }

        const active = updateTimer()
        if (!active) return

        const timerId = setInterval(updateTimer, 1000)
        return () => clearInterval(timerId)
    }, [teamData])

    const handleSearch = async (e) => {
        if (e) e.preventDefault()
        if (!teamIdInput.trim()) return toast.error('Please enter a Team ID')
        
        setLoading(true)
        try {
            const res = await axios.get(`${API}/api/students/team/${encodeURIComponent(teamIdInput.trim())}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTeamData(res.data)
            toast.success(`Team "${res.data.teamName}" loaded successfully!`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to find team')
            setTeamData(null)
        } finally {
            setLoading(false)
        }
    }

    const toggleMemberPresence = (studentId) => {
        if (teamData.isLocked) return
        setTeamData(prev => ({
            ...prev,
            members: prev.members.map(m => 
                m.studentId === studentId ? { ...m, isPresent: !m.isPresent } : m
            )
        }))
    }

    const handleSaveAttendance = async () => {
        if (teamData.isLocked) return
        setSaving(true)
        try {
            const payload = {
                members: teamData.members.map(m => ({
                    studentId: m.studentId,
                    isPresent: m.isPresent
                }))
            }
            const res = await axios.patch(
                `${API}/api/students/team/${encodeURIComponent(teamData.teamId)}/attendance`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setTeamData(prev => ({
                ...prev,
                attendanceMarkedAt: res.data.attendanceMarkedAt,
                isLocked: res.data.isLocked,
                members: prev.members.map(m => {
                    const match = res.data.members.find(x => x.studentId === m.studentId)
                    return match ? { ...m, isPresent: match.isPresent, presentAt: match.presentAt } : m
                })
            }))
            toast.success('Attendance saved successfully!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save attendance')
        } finally {
            setSaving(false)
        }
    }

    // Template-specific style selectors
    const getContainerClass = () => {
        if (selectedTemplate === 'pumpkin') return 'template-pumpkin-container p-6 rounded-2xl border border-orange-600/30 min-h-[500px] relative overflow-hidden transition-all duration-500'
        if (selectedTemplate === 'dracula') return 'template-dracula-container p-6 rounded-2xl border border-red-700/30 min-h-[500px] relative overflow-hidden transition-all duration-500'
        return 'template-witch-container p-6 rounded-2xl border border-green-600/30 min-h-[500px] relative overflow-hidden transition-all duration-500'
    }

    const getCardClass = () => {
        if (selectedTemplate === 'pumpkin') return 'template-pumpkin-card p-4 sm:p-5 rounded-xl border border-orange-500/20'
        if (selectedTemplate === 'dracula') return 'template-dracula-card p-4 sm:p-5 rounded-xl border border-red-600/20'
        return 'template-witch-card p-4 sm:p-5 rounded-xl border border-green-500/20'
    }

    const getTemplateTitleClass = () => {
        if (selectedTemplate === 'pumpkin') return 'spooky-title text-2xl md:text-3xl text-orange-500 text-center mb-1 flicker-text'
        if (selectedTemplate === 'dracula') return 'spooky-title text-2xl md:text-3xl text-red-600 text-center mb-1'
        return 'spooky-title-purple text-2xl md:text-3xl text-purple-500 text-center mb-1'
    }

    return (
        <div className="page-enter max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="spooky-title text-3xl font-extrabold flex items-center gap-2">
                        🧟 Mark Team Attendance
                    </h1>
                    <p className="text-gray-400 text-sm">Spooky real-time check-in by Team ID</p>
                </div>

                {/* Template Switcher */}
                <div className="flex items-center justify-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-orange-500/20 w-full sm:w-fit">
                    <button 
                        onClick={() => setSelectedTemplate('pumpkin')}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${selectedTemplate === 'pumpkin' ? 'bg-orange-500 text-black font-extrabold' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        🎃 Pumpkin
                    </button>
                    <button 
                        onClick={() => setSelectedTemplate('dracula')}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${selectedTemplate === 'dracula' ? 'bg-red-700 text-white font-extrabold' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        🧛 Dracula
                    </button>
                    <button 
                        onClick={() => setSelectedTemplate('witch')}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${selectedTemplate === 'witch' ? 'bg-green-500 text-black font-extrabold' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        🧪 Witch
                    </button>
                </div>
            </div>

            {/* Team ID Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 mb-6 max-w-xl items-stretch">
                <input
                    className="h-11 input text-base shadow-lg border-orange-500/20 w-full"
                    placeholder="Enter unique Team ID (e.g., HIET/CODE/2026/001)..."
                    value={teamIdInput}
                    onChange={(e) => setTeamIdInput(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading} className="h-11 btn btn-primary px-6 sm:w-auto w-full shrink-0 flex items-center justify-center">
                    {loading ? (
                        <>
                            <span className="spinner w-4 h-4 mr-2" />
                            Summoning...
                        </>
                    ) : (
                        '🔍 Search Team'
                    )}
                </button>
            </form>

            {/* Main Template Screen */}
            {teamData ? (
                <div className={getContainerClass()}>
                    {/* Background decorations based on templates */}
                    {selectedTemplate === 'pumpkin' && (
                        <div className="absolute top-2 right-4 text-4xl opacity-25 animate-bounce">🎃</div>
                    )}
                    {selectedTemplate === 'dracula' && (
                        <div className="absolute top-3 right-4 text-4xl opacity-20 animate-pulse">🦇</div>
                    )}
                    {selectedTemplate === 'witch' && (
                        <>
                            <div className="absolute top-3 right-4 text-4xl opacity-25">🧙‍♀️</div>
                            {/* Slime Bubbles */}
                            {bubbles.map(b => (
                                <div
                                    key={b.id}
                                    className="bubble-slime"
                                    style={{
                                        left: `${b.left}%`,
                                        width: `${b.size}px`,
                                        height: `${b.size}px`,
                                        animationDuration: `${b.duration}s`
                                    }}
                                />
                            ))}
                        </>
                    )}

                    {/* Team Info Header */}
                    <div className="mb-6 pb-5 border-b border-white/5 relative z-10">
                        <div className={getTemplateTitleClass()}>
                            {selectedTemplate === 'pumpkin' && `🎃 ${teamData.teamName} 🎃`}
                            {selectedTemplate === 'dracula' && `🦇 TEAM: ${teamData.teamName} 🧛`}
                            {selectedTemplate === 'witch' && `🧪 CAULDRON: ${teamData.teamName} 🧪`}
                        </div>
                        <div className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold">
                            Theme: <span className="text-orange-500 font-bold">{teamData.theme || 'NONE'}</span> | Team Size: <span className="text-purple-400 font-bold">{teamData.teamSize}</span>
                        </div>

                        {/* Lock / Modification Timer Info */}
                        <div className="mt-4 flex flex-col items-center justify-center">
                            {teamData.isLocked ? (
                                <div className="bg-red-950/80 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                    🔒 ATTENDANCE FINALIZED & LOCKED (Emailed to Admin)
                                </div>
                            ) : teamData.attendanceMarkedAt ? (
                                <div className="bg-orange-950/80 border border-orange-500/30 text-orange-400 px-5 py-2 rounded-xl text-center">
                                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-85">Modifications Lock Timer</div>
                                    <div className="text-base font-extrabold tracking-mono font-mono">{timeStr || 'Calculating...'}</div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">First marked: {new Date(teamData.attendanceMarkedAt).toLocaleTimeString('en-IN')}</div>
                                </div>
                            ) : (
                                <div className="bg-green-950/80 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                    🟢 Ready to Mark (4-hour modification window starts on Save)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Member Cards List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
                        {teamData.members.map((member) => (
                            <div key={member.studentId} className={getCardClass()}>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-extrabold text-white text-base break-words">{member.name}</span>
                                            {member.role === 'Leader' ? (
                                                <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                                                    👑 Leader
                                                </span>
                                            ) : (
                                                <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                                                    👥 Member
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-gray-400 font-mono mt-0.5 break-all">{member.studentId}</div>
                                        <div className="text-[11px] text-gray-400 mt-0.5 break-all">{member.email}</div>
                                    </div>

                                    {/* Present/Absent Status Badge */}
                                    <div className="shrink-0 mt-1 sm:mt-0">
                                        {member.isPresent ? (
                                            <span className="badge badge-green text-[10px]">Checked In</span>
                                        ) : (
                                            <span className="badge badge-red text-[10px]">Absent</span>
                                        )}
                                    </div>
                                </div>

                                {/* Toggle Action */}
                                <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <span className="text-xs text-gray-400 break-words">
                                        {member.isPresent 
                                            ? `Checked-in: ${member.presentAt ? new Date(member.presentAt).toLocaleTimeString('en-IN') : 'Just now'}`
                                            : 'Not checked in yet'}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={teamData.isLocked}
                                        onClick={() => toggleMemberPresence(member.studentId)}
                                        className={`btn text-xs px-3.5 py-1.5 w-full sm:w-auto ${member.isPresent ? 'btn-success font-extrabold' : 'btn-danger font-semibold'}`}
                                    >
                                        {member.isPresent ? '✓ Present' : '✗ Absent'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end pt-4 border-t border-white/5 relative z-10">
                        <button
                            onClick={handleSaveAttendance}
                            disabled={saving || teamData.isLocked}
                            className="btn btn-primary px-8 text-base shadow-xl"
                        >
                            {saving ? (
                                <>
                                    <span className="spinner w-4 h-4 mr-2" />
                                    Saving...
                                </>
                            ) : teamData.isLocked ? (
                                '🔒 Attendance Locked'
                            ) : (
                                '💾 Save Attendance'
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                /* Search Callout */
                <div className="spooky-card p-12 text-center flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4 animate-float-ghost">👻</div>
                    <h3 className="spooky-title text-xl mb-1">Summon a Team</h3>
                    <p className="text-gray-400 text-sm max-w-sm">
                        Enter a valid registered Team ID in the search box above to fetch all member details and verify their attendance.
                    </p>
                </div>
            )}
        </div>
    )
}
