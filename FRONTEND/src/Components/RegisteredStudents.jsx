import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

export default function RegisteredStudents() {
    const [students, setStudents] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('')   // '' | 'true' | 'false'
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)
    const token = localStorage.getItem('techfest_token')
    const admin = JSON.parse(localStorage.getItem('techfest_admin') || '{}')
    const navigate = useNavigate()
    const LIMIT = 15

    const fetchStudents = useCallback(async () => {
        setLoading(true)
        try {
            const params = { page, limit: LIMIT, search }
            if (filter) params.present = filter
            const res = await axios.get(`${API}/api/students`, {
                params, headers: { Authorization: `Bearer ${token}` }
            })
            setStudents(res.data.students)
            setTotal(res.data.total)
            setTotalPages(res.data.totalPages)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load students')
        }
        finally { setLoading(false) }
    }, [page, search, filter, token])

    useEffect(() => { fetchStudents() }, [fetchStudents])

    const handleExport = async () => {
        setExporting(true)
        try {
            const res = await axios.get(`${API}/api/students/export/all`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = URL.createObjectURL(res.data)
            const a = document.createElement('a'); a.href = url
            a.download = 'all_students.xlsx'; a.click()
            URL.revokeObjectURL(url)
            toast.success('Export downloaded!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load stats')
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="page-enter">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>🎓 Registered Students</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total: <strong style={{ color: '#f1f5f9' }}>{total}</strong></p>
                </div>
                {admin.role !== 'volunteer' && (
                    <button className="btn btn-success" onClick={handleExport} disabled={exporting}>
                        {exporting ? '⏳ Exporting...' : '📥 Export to Excel'}
                    </button>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <input
                    className="input"
                    placeholder="🔍 Search by ID, name, college, event..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    style={{ maxWidth: '380px' }}
                />
                <select
                    className="input"
                    value={filter}
                    onChange={e => { setFilter(e.target.value); setPage(1) }}
                    style={{ maxWidth: '180px' }}
                >
                    <option value="" className="bg-gray-500">All Status</option>
                    <option value="true" className="bg-gray-500">Present</option>
                    <option value="false" className="bg-gray-500">Absent</option>
                </select>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}><div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} /></div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    {['#', 'Team ID', 'Team Leader', 'Team Name', 'Event', 'College', 'Year', 'Status', 'Checked In'].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr><td colSpan={9} style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>No students found</td></tr>
                                ) : students.map((s, i) => (
                                    <tr key={s._id}>
                                        <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>{(page - 1) * LIMIT + i + 1}</td>
                                        <td><span style={{ fontFamily: 'monospace', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.8rem', color: '#a5b4fc' }}>{s.studentId}</span></td>
                                        <td style={{ fontWeight: 600 }}>{s.teamLeaderName}</td>
                                        <td>{s.teamName}</td>
                                        <td><span className="badge badge-blue">{s.eventName}</span></td>
                                        <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.college}</td>
                                        <td>{s.year}</td>
                                        <td>{s.isPresent
                                            ? <span className="badge badge-green">✅ Present</span>
                                            : <span className="badge badge-red">❌ Absent</span>}
                                        </td>
                                        <td style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                            {s.presentAt ? new Date(s.presentAt).toLocaleString('en-IN') : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                            <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Page {page} of {totalPages}</span>
                            <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
