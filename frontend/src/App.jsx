import { useState, useEffect } from 'react'

const API = '/api'

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f0f0f0; color: #222; font-family: sans-serif; min-height: 100vh; }

  .layout { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }

  .sidebar {
    background: #2c2c2c;
    color: #ddd;
    padding: 1.5rem 1rem;
    display: flex; flex-direction: column; gap: 0.3rem;
  }
  .sidebar h1 { font-size: 1.2rem; color: #fff; margin-bottom: 1.2rem; }
  .sidebar h1 span { display: block; font-size: 0.65rem; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
  .nav-btn {
    background: transparent; border: none; color: #bbb;
    font-family: sans-serif; font-size: 0.875rem;
    padding: 0.5rem 0.75rem; border-radius: 4px; cursor: pointer;
    text-align: left;
  }
  .nav-btn:hover { background: #3a3a3a; color: #fff; }
  .nav-btn.active { background: #4a7c59; color: #fff; }
  .nav-section { font-size: 0.65rem; text-transform: uppercase; color: #666; padding: 0.8rem 0.75rem 0.2rem; letter-spacing: 0.1em; }
  .schema-box { margin-top: auto; padding: 0.75rem; background: #1a1a1a; border-radius: 4px; font-size: 0.72rem; color: #777; line-height: 1.6; }
  .schema-box strong { color: #aaa; display: block; margin-bottom: 0.3rem; }

  .main { padding: 2rem; }
  .page-header { margin-bottom: 1.5rem; display: flex; align-items: flex-start; justify-content: space-between; }
  .page-header h2 { font-size: 1.4rem; font-weight: 600; }
  .page-header p { color: #666; font-size: 0.82rem; margin-top: 0.2rem; }
  .rel-badge { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 3px; }
  .badge-12 { background: #dbeafe; color: #1e40af; }
  .badge-mm { background: #dcfce7; color: #166534; }

  .btn { padding: 0.5rem 1rem; border-radius: 4px; border: 1px solid transparent; cursor: pointer; font-family: sans-serif; font-size: 0.85rem; }
  .btn-primary { background: #4a7c59; color: #fff; border-color: #4a7c59; }
  .btn-primary:hover { background: #3d6b4a; }
  .btn-danger { background: transparent; color: #c0392b; border-color: #c0392b; }
  .btn-danger:hover { background: #c0392b; color: #fff; }
  .btn-ghost { background: transparent; color: #555; border-color: #ccc; }
  .btn-ghost:hover { border-color: #888; color: #222; }
  .btn-sm { padding: 0.3rem 0.65rem; font-size: 0.78rem; }

  .card { background: #fff; border-radius: 6px; border: 1px solid #ddd; padding: 1.2rem; margin-bottom: 0.75rem; }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
  .card-title { font-size: 1rem; font-weight: 600; }
  .card-sub { font-size: 0.8rem; color: #666; margin-top: 0.15rem; }
  .card-actions { display: flex; gap: 0.4rem; }

  .tag { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.73rem; padding: 0.2rem 0.55rem; border-radius: 3px; background: #e8e8e8; color: #444; border: 1px solid #ccc; margin: 0.15rem; }
  .tag .remove { cursor: pointer; color: #999; }
  .tag .remove:hover { color: #c0392b; }

  .form-panel { background: #fff; border-radius: 6px; border: 1px solid #ddd; padding: 1.2rem; margin-bottom: 1.5rem; }
  .form-panel h3 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 0.9rem; }
  .form-row { display: flex; gap: 0.65rem; flex-wrap: wrap; }
  .form-group { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 160px; }
  label { font-size: 0.76rem; font-weight: 500; color: #555; }
  input, select, textarea {
    border: 1px solid #ccc; border-radius: 4px;
    padding: 0.45rem 0.7rem; font-family: sans-serif; font-size: 0.85rem;
    background: #fafafa; color: #222; width: 100%;
  }
  input:focus, select:focus { outline: none; border-color: #4a7c59; }
  select[multiple] { height: 85px; }

  .info-box { background: #f5f5f5; border-left: 3px solid #4a7c59; padding: 0.7rem 0.9rem; border-radius: 0 4px 4px 0; font-size: 0.8rem; color: #666; margin-bottom: 1.2rem; }
  .info-box strong { color: #333; }

  .empty { text-align: center; padding: 2.5rem; color: #999; font-size: 0.875rem; }
  .count { font-size: 0.75rem; color: #888; background: #e8e8e8; padding: 0.15rem 0.5rem; border-radius: 10px; margin-left: 0.4rem; }
  .toast { position: fixed; bottom: 1.2rem; right: 1.2rem; background: #2c2c2c; color: #fff; padding: 0.7rem 1rem; border-radius: 4px; font-size: 0.82rem; z-index: 100; }
`

const Toast = ({ msg }) => msg ? <div className="toast">{msg}</div> : null

function useToast() {
  const [msg, setMsg] = useState('')
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }
  return [msg, show]
}

function AuthorsPage({ toast }) {
  const [authors, setAuthors] = useState([])
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [editing, setEditing] = useState(null)

  const load = () => fetch(`${API}/authors`).then(r => r.json()).then(setAuthors)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!name.trim()) return
    if (editing) {
      await fetch(`${API}/authors/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, bio }) })
      toast('Author updated'); setEditing(null)
    } else {
      await fetch(`${API}/authors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, bio }) })
      toast('Author added')
    }
    setName(''); setBio(''); load()
  }

  const del = async (id) => {
    if (!confirm('Delete author and all their books?')) return
    await fetch(`${API}/authors/${id}`, { method: 'DELETE' })
    toast('Deleted'); load()
  }

  const edit = (a) => { setEditing(a._id); setName(a.name); setBio(a.bio || '') }

  return (
    <div>
      <div className="page-header">
        <div><h2>Authors <span className="count">{authors.length}</span></h2><p>One side of One → Many with Books</p></div>
        <span className="rel-badge badge-12">One-to-Many</span>
      </div>
      <div className="info-box">
        <strong>Relationship:</strong> One Author → Many Books. Deleting an author cascades and removes all their books.
      </div>
      <div className="form-panel">
        <h3>{editing ? 'Edit Author' : 'Add Author'}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Author name" />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
            <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add'}</button>
            {editing && <button className="btn btn-ghost" onClick={() => { setEditing(null); setName(''); setBio('') }}>Cancel</button>}
          </div>
        </div>
      </div>
      {authors.length === 0 ? <div className="empty">No authors yet.</div> :
        authors.map(a => (
          <div className="card" key={a._id}>
            <div className="card-header">
              <div>
                <div className="card-title">{a.name}</div>
                {a.bio && <div className="card-sub">{a.bio}</div>}
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => edit(a)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(a._id)}>Delete</button>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#999' }}>ID: <code>{a._id}</code></div>
          </div>
        ))}
    </div>
  )
}

function TagsPage({ toast }) {
  const [tags, setTags] = useState([])
  const [name, setName] = useState('')

  const load = () => fetch(`${API}/tags`).then(r => r.json()).then(setTags)
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim()) return
    await fetch(`${API}/tags`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    setName(''); toast('Tag added'); load()
  }

  const del = async (id) => {
    await fetch(`${API}/tags/${id}`, { method: 'DELETE' })
    toast('Tag deleted'); load()
  }

  return (
    <div>
      <div className="page-header">
        <div><h2>Tags <span className="count">{tags.length}</span></h2><p>Many side of Many-to-Many with Books</p></div>
        <span className="rel-badge badge-mm">Many-to-Many</span>
      </div>
      <div className="info-box">
        <strong>Relationship:</strong> One Tag can belong to Many Books. Deleting a tag removes it from all books via <code>$pull</code>.
      </div>
      <div className="form-panel">
        <h3>Add Tag</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Tag name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fiction, Classic" onKeyDown={e => e.key === 'Enter' && add()} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" onClick={add}>Add</button>
          </div>
        </div>
      </div>
      {tags.length === 0 ? <div className="empty">No tags yet.</div> :
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {tags.map(t => (
            <span className="tag" key={t._id} style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>
              {t.name}
              <span className="remove" onClick={() => del(t._id)}>×</span>
            </span>
          ))}
        </div>}
    </div>
  )
}

function BooksPage({ toast }) {
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [tags, setTags] = useState([])
  const [form, setForm] = useState({ title: '', year: '', author: '', tags: [] })
  const [editing, setEditing] = useState(null)

  const load = () => Promise.all([
    fetch(`${API}/books`).then(r => r.json()),
    fetch(`${API}/authors`).then(r => r.json()),
    fetch(`${API}/tags`).then(r => r.json()),
  ]).then(([b, a, t]) => { setBooks(b); setAuthors(a); setTags(t) })

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title.trim() || !form.author) return
    const body = { ...form, year: form.year ? +form.year : undefined }
    if (editing) {
      await fetch(`${API}/books/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      toast('Book updated'); setEditing(null)
    } else {
      await fetch(`${API}/books`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      toast('Book added')
    }
    setForm({ title: '', year: '', author: '', tags: [] }); load()
  }

  const del = async (id) => {
    if (!confirm('Delete this book?')) return
    await fetch(`${API}/books/${id}`, { method: 'DELETE' })
    toast('Deleted'); load()
  }

  const edit = (b) => {
    setEditing(b._id)
    setForm({ title: b.title, year: b.year || '', author: b.author._id, tags: b.tags.map(t => t._id) })
  }

  const toggleTag = (id) => {
    setForm(f => ({ ...f, tags: f.tags.includes(id) ? f.tags.filter(x => x !== id) : [...f.tags, id] }))
  }

  return (
    <div>
      <div className="page-header">
        <div><h2>Books <span className="count">{books.length}</span></h2><p>Demonstrates both relationships</p></div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <span className="rel-badge badge-12">One-to-Many</span>
          <span className="rel-badge badge-mm">Many-to-Many</span>
        </div>
      </div>
      <div className="info-box">
        <strong>Book is the junction:</strong> holds one <code>author</code> ref (1:M) and an array of <code>tags</code> refs (M:M). Mongoose <code>.populate()</code> resolves both.
      </div>
      <div className="form-panel">
        <h3>{editing ? 'Edit Book' : 'Add Book'}</h3>
        <div className="form-row" style={{ marginBottom: '0.65rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Book title" />
          </div>
          <div className="form-group" style={{ maxWidth: 90 }}>
            <label>Year</label>
            <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" type="number" />
          </div>
          <div className="form-group">
            <label>Author (One-to-Many)</label>
            <select value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}>
              <option value="">Select author…</option>
              {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '0.65rem' }}>
          <label>Tags (Many-to-Many) — click to toggle</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
            {tags.map(t => (
              <span key={t._id} className="tag" onClick={() => toggleTag(t._id)}
                style={{ cursor: 'pointer', background: form.tags.includes(t._id) ? '#d1fae5' : undefined, borderColor: form.tags.includes(t._id) ? '#059669' : undefined, color: form.tags.includes(t._id) ? '#065f46' : undefined }}>
                {form.tags.includes(t._id) ? '✓ ' : ''}{t.name}
              </span>
            ))}
            {tags.length === 0 && <span style={{ fontSize: '0.78rem', color: '#999' }}>Add tags first</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add Book'}</button>
          {editing && <button className="btn btn-ghost" onClick={() => { setEditing(null); setForm({ title: '', year: '', author: '', tags: [] }) }}>Cancel</button>}
        </div>
      </div>
      {books.length === 0 ? <div className="empty">No books yet. Add authors and tags first.</div> :
        books.map(b => (
          <div className="card" key={b._id}>
            <div className="card-header">
              <div>
                <div className="card-title">{b.title} {b.year && <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 400 }}>({b.year})</span>}</div>
                <div className="card-sub">by <strong>{b.author?.name}</strong> <span className="rel-badge badge-12" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', marginLeft: '0.3rem' }}>1:M</span></div>
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => edit(b)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(b._id)}>Delete</button>
              </div>
            </div>
            {b.tags?.length > 0 && (
              <div style={{ marginTop: '0.4rem' }}>
                {b.tags.map(t => <span key={t._id} className="tag">{t.name}</span>)}
                <span className="rel-badge badge-mm" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', marginLeft: '0.3rem' }}>M:M</span>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('books')
  const [toastMsg, showToast] = useToast()

  const pages = { authors: <AuthorsPage toast={showToast} />, tags: <TagsPage toast={showToast} />, books: <BooksPage toast={showToast} /> }

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <nav className="sidebar">
          <h1><span>MongoDB</span>Bookshelf</h1>
          <div className="nav-section">Collections</div>
          {[['authors','Authors'],['tags','Tags'],['books','Books']].map(([id,label]) => (
            <button key={id} className={`nav-btn ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>{label}</button>
          ))}
          <div className="schema-box">
            <strong>Relationships</strong>
            Author → Books (1:M)<br/>
            Books ↔ Tags (M:M)<br/>
            via ObjectId refs
          </div>
        </nav>
        <main className="main">{pages[page]}</main>
      </div>
      <Toast msg={toastMsg} />
    </>
  )
}
