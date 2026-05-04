import { useState, useEffect } from 'react'

const API = '/api'

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #1a1208;
    --paper: #f5f0e8;
    --cream: #ede8d8;
    --amber: #c8860a;
    --amber-light: #e8a020;
    --rust: #8b3a1a;
    --sage: #4a5c40;
    --muted: #7a6f5e;
    --border: #d4c9b0;
  }
  body { background: var(--paper); color: var(--ink); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  h1,h2,h3 { font-family: 'Playfair Display', serif; }

  .layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
  
  .sidebar {
    background: var(--ink);
    color: var(--paper);
    padding: 2rem 1.5rem;
    position: sticky; top: 0; height: 100vh;
    display: flex; flex-direction: column; gap: 0.5rem;
    overflow-y: auto;
  }
  .sidebar h1 { font-size: 1.6rem; color: var(--amber-light); margin-bottom: 1.5rem; line-height: 1.2; }
  .sidebar h1 span { display: block; font-size: 0.7rem; font-family: 'DM Sans', sans-serif; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.3rem; }
  .nav-btn {
    background: transparent; border: none; color: var(--paper);
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    padding: 0.7rem 1rem; border-radius: 6px; cursor: pointer;
    text-align: left; transition: all 0.15s; opacity: 0.7;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.08); opacity: 1; }
  .nav-btn.active { background: var(--amber); color: var(--ink); opacity: 1; font-weight: 500; }
  .nav-section { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); padding: 1rem 1rem 0.3rem; }
  .schema-box { margin-top: auto; padding: 1rem; background: rgba(255,255,255,0.06); border-radius: 8px; font-size: 0.75rem; color: #a09070; line-height: 1.6; }
  .schema-box strong { color: var(--amber-light); display: block; margin-bottom: 0.4rem; }

  .main { padding: 2.5rem; overflow-y: auto; }
  .page-header { margin-bottom: 2rem; display: flex; align-items: flex-end; justify-content: space-between; }
  .page-header h2 { font-size: 2rem; }
  .page-header p { color: var(--muted); font-size: 0.85rem; margin-top: 0.3rem; }
  .rel-badge { font-size: 0.7rem; font-family: 'DM Sans', sans-serif; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.3rem 0.7rem; border-radius: 20px; }
  .badge-12 { background: #dbeafe; color: #1e40af; }
  .badge-mm { background: #dcfce7; color: #166534; }

  .btn { padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; transition: all 0.15s; }
  .btn-primary { background: var(--amber); color: var(--ink); }
  .btn-primary:hover { background: var(--amber-light); }
  .btn-danger { background: transparent; color: var(--rust); border: 1px solid var(--rust); }
  .btn-danger:hover { background: var(--rust); color: white; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--ink); color: var(--ink); }
  .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }

  .card { background: white; border-radius: 10px; border: 1px solid var(--border); padding: 1.5rem; margin-bottom: 1rem; transition: box-shadow 0.15s; }
  .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
  .card-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; }
  .card-sub { font-size: 0.82rem; color: var(--muted); margin-top: 0.2rem; }
  .card-actions { display: flex; gap: 0.5rem; }

  .tag { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 20px; background: var(--cream); color: var(--sage); border: 1px solid var(--border); margin: 0.2rem; font-weight: 500; }
  .tag .remove { cursor: pointer; color: var(--muted); font-size: 0.9rem; line-height: 1; }
  .tag .remove:hover { color: var(--rust); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .form-panel { background: white; border-radius: 10px; border: 1px solid var(--border); padding: 1.5rem; margin-bottom: 2rem; }
  .form-panel h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--muted); font-family: 'DM Sans', sans-serif; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.8rem; }
  .form-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .form-group { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 180px; }
  label { font-size: 0.78rem; font-weight: 500; color: var(--muted); }
  input, select, textarea {
    border: 1px solid var(--border); border-radius: 6px;
    padding: 0.55rem 0.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    background: var(--paper); color: var(--ink); transition: border-color 0.15s;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus { outline: none; border-color: var(--amber); }
  select[multiple] { height: 90px; }

  .info-box { background: var(--cream); border-left: 3px solid var(--amber); padding: 0.8rem 1rem; border-radius: 0 6px 6px 0; font-size: 0.82rem; color: var(--muted); margin-bottom: 1.5rem; }
  .info-box strong { color: var(--ink); }

  .empty { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.9rem; }
  .count { font-size: 0.78rem; color: var(--muted); background: var(--cream); padding: 0.2rem 0.6rem; border-radius: 20px; margin-left: 0.5rem; }
  .toast { position: fixed; bottom: 1.5rem; right: 1.5rem; background: var(--ink); color: var(--paper); padding: 0.8rem 1.2rem; border-radius: 8px; font-size: 0.85rem; z-index: 100; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`

const Toast = ({ msg }) => msg ? <div className="toast">{msg}</div> : null

function useToast() {
  const [msg, setMsg] = useState('')
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }
  return [msg, show]
}

// ─── AUTHORS PAGE ──────────────────────────────────────────────────────────────

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
        <div><h2>Authors <span className="count">{authors.length}</span></h2><p>Manages the "one" side of One → Many with Books</p></div>
        <span className="rel-badge badge-12">One-to-Many</span>
      </div>
      <div className="info-box">
        <strong>Relationship:</strong> One Author → Many Books. Deleting an author cascades and removes all their books. Each Book stores an <code>author</code> ObjectId reference.
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
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add'}</button>
            {editing && <button className="btn btn-ghost" onClick={() => { setEditing(null); setName(''); setBio('') }}>Cancel</button>}
          </div>
        </div>
      </div>
      {authors.length === 0 ? <div className="empty">No authors yet. Add one above.</div> :
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
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>ID: <code style={{ fontSize: '0.75rem' }}>{a._id}</code></div>
          </div>
        ))}
    </div>
  )
}

// ─── TAGS PAGE ─────────────────────────────────────────────────────────────────

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
    toast('Tag deleted from all books'); load()
  }

  return (
    <div>
      <div className="page-header">
        <div><h2>Tags <span className="count">{tags.length}</span></h2><p>The shared "many" side of the Many-to-Many with Books</p></div>
        <span className="rel-badge badge-mm">Many-to-Many</span>
      </div>
      <div className="info-box">
        <strong>Relationship:</strong> One Tag can belong to Many Books, and one Book can have Many Tags. Books store an array of Tag ObjectId references. Deleting a tag pulls it from all books via <code>$pull</code>.
      </div>
      <div className="form-panel">
        <h3>Add Tag</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Tag name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fiction, Sci-Fi, Classic" onKeyDown={e => e.key === 'Enter' && add()} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" onClick={add}>Add Tag</button>
          </div>
        </div>
      </div>
      {tags.length === 0 ? <div className="empty">No tags yet.</div> :
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map(t => (
            <span className="tag" key={t._id} style={{ fontSize: '0.875rem', padding: '0.4rem 0.9rem' }}>
              {t.name}
              <span className="remove" onClick={() => del(t._id)}>×</span>
            </span>
          ))}
        </div>}
    </div>
  )
}

// ─── BOOKS PAGE ────────────────────────────────────────────────────────────────

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
        <div><h2>Books <span className="count">{books.length}</span></h2><p>Demonstrates both relationships simultaneously</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="rel-badge badge-12">One-to-Many</span>
          <span className="rel-badge badge-mm">Many-to-Many</span>
        </div>
      </div>
      <div className="info-box">
        <strong>Book is the junction:</strong> It holds a single <code>author</code> ref (One-to-Many) and an array of <code>tags</code> refs (Many-to-Many). Mongoose <code>.populate()</code> resolves both in one query.
      </div>
      <div className="form-panel">
        <h3>{editing ? 'Edit Book' : 'Add Book'}</h3>
        <div className="form-row" style={{ marginBottom: '0.75rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Book title" />
          </div>
          <div className="form-group" style={{ maxWidth: 100 }}>
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
        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
          <label>Tags (Many-to-Many) — click to toggle</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
            {tags.map(t => (
              <span key={t._id} className="tag" onClick={() => toggleTag(t._id)}
                style={{ cursor: 'pointer', background: form.tags.includes(t._id) ? '#d1fae5' : undefined, borderColor: form.tags.includes(t._id) ? '#059669' : undefined, color: form.tags.includes(t._id) ? '#065f46' : undefined }}>
                {form.tags.includes(t._id) ? '✓ ' : ''}{t.name}
              </span>
            ))}
            {tags.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Add tags on the Tags page first</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add Book'}</button>
          {editing && <button className="btn btn-ghost" onClick={() => { setEditing(null); setForm({ title: '', year: '', author: '', tags: [] }) }}>Cancel</button>}
        </div>
      </div>
      {books.length === 0 ? <div className="empty">No books yet. Add authors and tags first.</div> :
        books.map(b => (
          <div className="card" key={b._id}>
            <div className="card-header">
              <div>
                <div className="card-title">{b.title} {b.year && <span style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 400 }}>({b.year})</span>}</div>
                <div className="card-sub">by <strong>{b.author?.name}</strong> <span className="rel-badge badge-12" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', marginLeft: '0.3rem' }}>1:M</span></div>
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => edit(b)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(b._id)}>Delete</button>
              </div>
            </div>
            {b.tags?.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                {b.tags.map(t => <span key={t._id} className="tag">{t.name}</span>)}
                <span className="rel-badge badge-mm" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', marginLeft: '0.3rem' }}>M:M</span>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

// ─── APP SHELL ─────────────────────────────────────────────────────────────────

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
          {[['authors','👤','Authors'],['tags','🏷','Tags'],['books','📚','Books']].map(([id,icon,label]) => (
            <button key={id} className={`nav-btn ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>{icon} {label}</button>
          ))}
          <div className="schema-box">
            <strong>Schema Relationships</strong>
            Author →{'{}'} Books<br/>
            <span style={{color:'#6b9'}}>One-to-Many</span><br/><br/>
            Books ↔{'{}'} Tags<br/>
            <span style={{color:'#9b6'}}>Many-to-Many</span><br/><br/>
            via ObjectId refs +<br/>populate()
          </div>
        </nav>
        <main className="main">{pages[page]}</main>
      </div>
      <Toast msg={toastMsg} />
    </>
  )
}
