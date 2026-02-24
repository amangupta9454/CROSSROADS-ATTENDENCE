import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

export default function AudienceList() {
    const [audience, setAudience] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)
    const token = localStorage.getItem('techfest_token')
    const admin = JSON.parse(localStorage.getItem('techfest_admin') || '{}')
    const navigate = useNavigate()
    const LIMIT = 15

    const fetchAudience = useCallback(async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API}/api/audience`, {
                params: { page, limit: LIMIT, search },
                headers: { Authorization: `Bearer ${token}` }
            })
            setAudience(res.data.audience)
            setTotal(res.data.total)
            setTotalPages(res.data.totalPages)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load audience')
        }
        finally { setLoading(false) }
    }, [page, search, token])

    useEffect(() => { fetchAudience() }, [fetchAudience])

    const handleExport = async () => {
        setExporting(true)
        try {
            const res = await axios.get(`${API}/api/audience/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = URL.createObjectURL(res.data)
            const a = document.createElement('a'); a.href = url
            a.download = 'audience_data.xlsx'; a.click()
            URL.revokeObjectURL(url)
            toast.success('Export downloaded!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Export failed')
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="page-enter">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>🎟️ Audience Attendance</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total walk-ins: <strong style={{ color: '#f59e0b' }}>{total}</strong></p>
                </div>
                {admin.role !== 'volunteer' && (
                    <button className="btn btn-success" onClick={handleExport} disabled={exporting}>
                        {exporting ? '⏳ Exporting...' : '📥 Export to Excel'}
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', marginBottom: '1.25rem' }}>
                <input
                    className="input"
                    placeholder="🔍 Search by name, email, college..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    style={{ maxWidth: '380px' }}
                />
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}><div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} /></div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    {['#', 'Role', 'Name', 'Email', 'Mobile', 'Type Details', 'Addtl Info', 'Registered At'].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {audience.length === 0 ? (
                                    <tr><td colSpan={9} style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>No audience registered yet</td></tr>
                                ) : audience.map((a, i) => (
                                    <tr key={a._id}>
                                        <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>{(page - 1) * LIMIT + i + 1}</td>
                                        <td style={{ fontWeight: 600, color: '#8b5cf6' }}>{a.role || 'Audience'}</td>
                                        <td style={{ fontWeight: 600 }}>{a.name}</td>
                                        <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{a.email}</td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{a.mobile}</td>
                                        <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                            {a.role === 'Student' && a.college ? `College: ${a.college}` : ''}
                                            {a.role === 'Parents' && a.childName ? `Child: ${a.childName}` : ''}
                                            {a.role === 'Faculty' && a.designation ? `Desig: ${a.designation}` : ''}
                                        </td>
                                        <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                            {a.role === 'Student' && (a.branch || a.course || a.year) ? [a.course, a.branch, a.year].filter(Boolean).join(' | ') : ''}
                                            {a.role === 'Parents' && a.address ? `${a.address}` : ''}
                                            {a.role === 'Faculty' && a.department ? `Dept: ${a.department}` : ''}
                                        </td>
                                        <td style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                            {a.presentAt ? new Date(a.presentAt).toLocaleString('en-IN') : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
