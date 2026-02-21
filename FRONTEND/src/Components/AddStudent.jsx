import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_BACKEND_URL

// ── Manual Form ────────────────────────────────────────────────────────
const BLANK = {
    studentId: '', teamName: '', teamLeaderName: '', leaderEmail: '',
    leaderMobile: '', college: '', branch: '', year: '', eventName: '', teamSize: '1',
    teamMembers: Array(8).fill(''),
}

const Field = ({ label, name, placeholder, value, onChange, type = 'text', required = false, half = false }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 1' }}>
        <label className="input-label">{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
        <input className="input" name={name} type={type} placeholder={placeholder}
            value={value} onChange={onChange} required={required} />
    </div>
)

function ManualForm() {
    const [form, setForm] = useState(BLANK)
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('techfest_token')

    const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    const handleMember = (i, val) => setForm(f => ({ ...f, teamMembers: f.teamMembers.map((m, idx) => idx === i ? val : m) }))

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                ...form,
                teamSize: Number(form.teamSize),
                teamMembers: form.teamMembers.filter(m => m.trim()),
            }
            await axios.post(`${API}/api/students`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(`Student "${form.studentId}" added successfully! ✅`)
            setForm(BLANK)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add student')
        } finally {
            setLoading(false)
        }
    }

    const memberCount = Number(form.teamSize) || 1

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <Field label="Student ID" name="studentId" placeholder="e.g. TF2025-001" value={form.studentId} onChange={handle} required />
                <Field label="Team Name" name="teamName" placeholder="Team name" value={form.teamName} onChange={handle} required />
                <Field label="Team Leader Name" name="teamLeaderName" placeholder="Full name" value={form.teamLeaderName} onChange={handle} required />
                <Field label="Leader Email" name="leaderEmail" placeholder="email@example.com" type="email" value={form.leaderEmail} onChange={handle} required />
                <Field label="Leader Mobile" name="leaderMobile" placeholder="10-digit mobile" value={form.leaderMobile} onChange={handle} required />
                <Field label="College" name="college" placeholder="College name" value={form.college} onChange={handle} required />
                <Field label="Branch" name="branch" placeholder="e.g. CSE" value={form.branch} onChange={handle} required />
                <div>
                    <label className="input-label">Year <span style={{ color: '#ef4444' }}>*</span></label>
                    <select className="input" name="year" value={form.year} onChange={handle} required>
                        <option value="">Select Year</option>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y}>{y}</option>)}
                    </select>
                </div>
                <Field label="Event Name" name="eventName" placeholder="e.g. Hackathon" value={form.eventName} onChange={handle} required />
                <div>
                    <label className="input-label">Team Size <span style={{ color: '#ef4444' }}>*</span></label>
                    <select className="input" name="teamSize" value={form.teamSize} onChange={handle}>
                        {Array.from({ length: 8 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                </div>
            </div>

            {/* Team members */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Team Members ({memberCount})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {Array.from({ length: memberCount }, (_, i) => (
                        <div key={i}>
                            <label className="input-label">Member {i + 1}</label>
                            <input className="input" placeholder={`Member ${i + 1} full name`}
                                value={form.teamMembers[i]} onChange={e => handleMember(i, e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}
                style={{ padding: '0.9rem 2rem' }}>
                {loading
                    ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Adding...</>
                    : '➕ Add Student'}
            </button>
        </form>
    )
}

// ── Bulk Upload ────────────────────────────────────────────────────────
function BulkUpload() {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const token = localStorage.getItem('techfest_token')

    const onDrop = useCallback(accepted => {
        if (accepted[0]) { setFile(accepted[0]); setResult(null) }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
    })

    const handleUpload = async () => {
        if (!file) return toast.error('Please select a file first')
        setUploading(true)
        setProgress(0)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await axios.post(`${API}/api/students/bulk-upload`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                onUploadProgress: e => setProgress(Math.round(e.loaded * 100 / e.total)),
            })
            setResult(res.data)
            toast.success(`Inserted ${res.data.inserted} records!`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {/* Template hint */}
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <strong style={{ color: '#818cf8' }}>📋 Required Excel Columns (exact names):</strong>
                <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#a5b4fc', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {['student_id', 'team_name', 'team_leader_name', 'leader_email', 'leader_mobile', 'college', 'branch', 'year', 'event_name', 'team_size', 'team_member_name_1', '...', 'team_member_name_8'].map(c => (
                        <span key={c} style={{ background: 'rgba(99,102,241,0.15)', padding: '0.15rem 0.5rem', borderRadius: '0.35rem' }}>{c}</span>
                    ))}
                </div>
            </div>

            {/* Drop zone */}
            <div {...getRootProps()} className={`dropzone${isDragActive ? ' active' : ''}`} style={{ marginBottom: '1.5rem' }}>
                <input {...getInputProps()} />
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                    {file ? '📄' : '☁️'}
                </div>
                {file ? (
                    <>
                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{file.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            {(file.size / 1024).toFixed(1)} KB — ready to upload
                        </div>
                        <button type="button" style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                            onClick={e => { e.stopPropagation(); setFile(null); setResult(null) }}>
                            ✕ Remove
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                            {isDragActive ? 'Drop it here!' : 'Drag & drop your Excel file here'}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>or click to browse · .xlsx, .xls, .csv supported</div>
                    </>
                )}
            </div>

            {/* Progress */}
            {uploading && (
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <span>Uploading & processing...</span><span>{progress}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '99px', transition: 'width 0.3s' }} />
                    </div>
                </div>
            )}

            <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}
                style={{ padding: '0.9rem 2rem', marginBottom: '1.5rem' }}>
                {uploading
                    ? <><span className="spinner" style={{ width: '18px', height: '18px' }} />Processing...</>
                    : '📤 Upload & Process'}
            </button>

            {/* Result summary */}
            {result && (
                <div className="animate-fade-up" style={{ borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', background: 'rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>📊</span>
                        <strong style={{ color: '#10b981' }}>Upload Summary</strong>
                    </div>
                    <div style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                            {[
                                ['Total Rows', result.totalProcessed, '#94a3b8'],
                                ['✅ Inserted', result.inserted, '#10b981'],
                                ['⚠️ Duplicates', result.duplicatesSkipped, '#f59e0b'],
                                ['❌ Failed', result.failedRows, '#ef4444'],
                            ].map(([label, val, color]) => (
                                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.6rem', padding: '0.75rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{val ?? 0}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                        {result.errors?.length > 0 && (
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f87171', marginBottom: '0.5rem' }}>Error Details:</div>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {result.errors.slice(0, 20).map((e, i) => (
                                        <div key={i} style={{ background: 'rgba(239,68,68,0.08)', borderRadius: '0.4rem', padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}>
                                            <strong style={{ color: '#fca5a5' }}>Row {e.row} {e.studentId ? `(${e.studentId})` : ''}:</strong>
                                            <span style={{ color: '#94a3b8', marginLeft: '0.4rem' }}>{Array.isArray(e.errors) ? e.errors.join(', ') : e.errors}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Main AddStudent Component ──────────────────────────────────────────
export default function AddStudent() {
    const [tab, setTab] = useState('manual')

    const TabBtn = ({ id, label, icon }) => (
        <button
            className={`btn${tab === id ? ' btn-primary' : ' btn-ghost'}`}
            onClick={() => setTab(id)}
            style={{ flex: 1, borderRadius: '0.6rem', padding: '0.7rem 1rem' }}
        >
            <span>{icon}</span> {label}
        </button>
    )

    return (
        <div className="page-enter" style={{ maxWidth: '780px' }}>
            <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>➕ Add Student Data</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Add a single student manually or bulk-upload via Excel</p>
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <TabBtn id="manual" label="Manual Entry" icon="✍️" />
                <TabBtn id="bulk" label="Bulk Upload" icon="📤" />
            </div>

            <div className="card">
                {tab === 'manual' ? <ManualForm /> : <BulkUpload />}
            </div>
        </div>
    )
}
