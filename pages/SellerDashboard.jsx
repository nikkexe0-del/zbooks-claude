import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, X, Check, Store, BookOpen, TrendingUp, Eye, Instagram, LogOut, Tag, Link2, Loader2, PlusCircle, XCircle } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import styles from './SellerDashboard.module.css'

const CONDITIONS = ['Like New', 'Good', 'Fair']

const EMPTY_FORM = { title: '', author: '', price: '', scrapedPrice: '', genre: 'Fiction', condition: 'Good', description: '', image: '', importUrl: '' }

export default function SellerDashboard() {
  const { books, addBook, updateBook, deleteBook, isSellerLoggedIn, sellerLogout, genres, addGenre, removeGenre } = useBooks()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [newGenre, setNewGenre] = useState('')
  const [showGenreManager, setShowGenreManager] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const navigate = useNavigate()

  if (!isSellerLoggedIn) {
    navigate('/seller-login')
    return null
  }

  const openAdd = () => {
    setEditId(null)
    setForm({ ...EMPTY_FORM, genre: genres[0] || 'Fiction' })
    setShowForm(true)
    setImportError('')
  }

  const openEdit = (book) => {
    setEditId(book.id)
    setForm({
      title: book.title,
      author: book.author,
      price: String(book.price),
      scrapedPrice: book.scrapedPrice ? String(book.scrapedPrice) : '',
      genre: book.genre || genres[0] || 'Fiction',
      condition: book.condition,
      description: book.description || '',
      image: book.image || '',
      importUrl: book.importUrl || '',
    })
    setShowForm(true)
    setImportError('')
  }

  const closeForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setImportError('')
  }

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleImportUrl = async () => {
    const url = form.importUrl.trim()
    if (!url) return
    setImporting(true)
    setImportError('')
    try {
      // Use Claude with web_search to resolve any Amazon/Flipkart URL (short or long)
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{
            role: 'user',
            content: `Search for this Amazon/Flipkart book URL and extract details: ${url}\n\nSearch for the book at this URL or its short-link destination. Return ONLY a JSON object with no markdown:\n{"title":"","author":"","price":0,"image":""}\n\nprice = MRP in INR as integer. image = direct book cover image URL. No explanation, no code fences.`
          }],
        }),
      })
      const data = await res.json()

      // Multi-turn: if stopped for tool use, send tool results back
      let content = data.content || []
      let messages = [
        { role: 'user', content: `Search for this Amazon/Flipkart book URL and extract details: ${url}\n\nSearch for the book at this URL or its short-link destination. Return ONLY a JSON object with no markdown:\n{"title":"","author":"","price":0,"image":""}\n\nprice = MRP in INR as integer. image = direct book cover image URL. No explanation, no code fences.` },
        { role: 'assistant', content },
      ]

      // If model stopped due to tool_use, we need to feed tool results back
      if (data.stop_reason === 'tool_use') {
        const toolUseBlocks = content.filter(b => b.type === 'tool_use')
        const toolResults = toolUseBlocks.map(b => ({
          type: 'tool_result',
          tool_use_id: b.id,
          content: 'Please use the search results to extract the book title, author, MRP price in INR, and cover image URL, then return ONLY JSON.',
        }))
        messages.push({ role: 'user', content: toolResults })

        const res2 = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            tools: [{ type: 'web_search_20250305', name: 'web_search' }],
            messages,
          }),
        })
        const data2 = await res2.json()
        content = data2.content || []
      }

      const lastText = content.filter(b => b.type === 'text').pop()?.text || ''
      const jsonMatch = lastText.match(/\{[\s\S]*?\}/)
      if (!jsonMatch) throw new Error('Could not parse book details.')
      const parsed = JSON.parse(jsonMatch[0])

      if (!parsed.title) throw new Error('Book not found at that URL.')

      setForm(prev => ({
        ...prev,
        title: parsed.title || prev.title,
        author: parsed.author || prev.author,
        image: parsed.image || prev.image,
        scrapedPrice: parsed.price ? String(parsed.price) : prev.scrapedPrice,
      }))
    } catch (err) {
      setImportError(err.message || 'Could not fetch. Try a full amazon.in product URL.')
    }
    setImporting(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      price: Number(form.price) || 0,
      scrapedPrice: form.scrapedPrice ? Number(form.scrapedPrice) : undefined,
    }
    if (editId) {
      updateBook(editId, data)
    } else {
      addBook(data)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    closeForm()
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteBook(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleAddGenre = () => {
    if (newGenre.trim()) {
      addGenre(newGenre.trim())
      setNewGenre('')
    }
  }

  const totalValue = books.reduce((sum, b) => sum + b.price, 0)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerBadge}>
              <Store size={14} />
              Seller Dashboard
            </div>
            <h1 className={styles.title}>Manage Your Listings</h1>
            <p className={styles.subtitle}>List books, set prices, and connect buyers via Instagram.</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => setShowGenreManager(true)} className={styles.genreBtn}>
              <Tag size={16} />
              Genres
            </button>
            <button onClick={openAdd} className={styles.addBtn}>
              <Plus size={18} />
              List New Book
            </button>
            <button onClick={() => { sellerLogout(); navigate('/') }} className={styles.logoutBtn}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><BookOpen size={20} /></div>
            <div>
              <div className={styles.statValue}>{books.length}</div>
              <div className={styles.statLabel}>Total Listings</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><TrendingUp size={20} /></div>
            <div>
              <div className={styles.statValue}>₹{totalValue.toLocaleString()}</div>
              <div className={styles.statLabel}>Total Value Listed</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Instagram size={20} /></div>
            <div>
              <div className={styles.statValue}>@nikkk.exe</div>
              <div className={styles.statLabel}>Contact Handle</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Eye size={20} /></div>
            <div>
              <div className={styles.statValue}>
                ₹{books.length > 0 ? Math.round(totalValue / books.length) : 0}
              </div>
              <div className={styles.statLabel}>Avg. Price</div>
            </div>
          </div>
        </div>

        {/* Listings table */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Listings ({books.length})</h2>
            <Link to="/" className={styles.viewStoreBtn}>
              <Eye size={14} />
              View Store
            </Link>
          </div>

          {books.length === 0 ? (
            <div className={styles.empty}>
              <span>📚</span>
              <h3>No listings yet</h3>
              <p>Click "List New Book" to get started</p>
              <button onClick={openAdd} className="btn-primary">
                <Plus size={16} />
                Add First Book
              </button>
            </div>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span className={styles.colImage}>Image</span>
                <span className={styles.colTitle}>Title & Author</span>
                <span className={styles.colGenre}>Genre</span>
                <span className={styles.colCondition}>Condition</span>
                <span className={styles.colPrice}>Price</span>
                <span className={styles.colActions}>Actions</span>
              </div>

              {books.map(book => (
                <div key={book.id} className={styles.tableRow}>
                  <div className={styles.colImage}>
                    {book.image ? (
                      <img src={book.image} alt={book.title} className={styles.rowImg} onError={e => e.target.style.display='none'} />
                    ) : (
                      <div className={styles.rowImgFallback}>📚</div>
                    )}
                  </div>
                  <div className={styles.colTitle}>
                    <span className={styles.rowTitle}>{book.title}</span>
                    <span className={styles.rowAuthor}>{book.author}</span>
                  </div>
                  <div className={styles.colGenre}>
                    <span className={styles.genreTag}>{book.genre}</span>
                  </div>
                  <div className={styles.colCondition}>
                    <span className={`${styles.condTag} ${styles['cond_' + book.condition?.replace(/\s+/g, '_')]}`}>
                      {book.condition}
                    </span>
                  </div>
                  <div className={styles.colPrice}>
                    {book.scrapedPrice ? (
                      <div className={styles.priceBlock}>
                        <span className={styles.rowPriceStrike}>₹{book.scrapedPrice}</span>
                        <a href="https://instagram.com/nikkk.exe" target="_blank" rel="noopener noreferrer" className={styles.rowPriceDm}>DM</a>
                      </div>
                    ) : (
                      <span className={styles.rowPrice}>₹{book.price}</span>
                    )}
                  </div>
                  <div className={styles.colActions}>
                    <button onClick={() => openEdit(book)} className={styles.editBtn} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className={`${styles.deleteBtn} ${deleteConfirm === book.id ? styles.deleteConfirm : ''}`}
                      title={deleteConfirm === book.id ? 'Click again to confirm' : 'Delete'}
                    >
                      {deleteConfirm === book.id ? <Check size={14} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Genre Manager Modal */}
      {showGenreManager && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setShowGenreManager(false)}>
          <div className={styles.modal} style={{ maxWidth: 440 }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}><Tag size={18} /> Manage Genres</h2>
              <button onClick={() => setShowGenreManager(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <div className={styles.genreManagerBody}>
              <p className={styles.genreManagerNote}>Add or remove genres that appear in filters and the add-book form.</p>
              <div className={styles.genreChips}>
                {genres.map(g => (
                  <div key={g} className={styles.genreChip}>
                    {g}
                    <button onClick={() => removeGenre(g)} className={styles.genreChipRemove} title="Remove genre">
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.genreAddRow}>
                <input
                  className={styles.input}
                  placeholder="New genre name…"
                  value={newGenre}
                  onChange={e => setNewGenre(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddGenre()}
                />
                <button onClick={handleAddGenre} className={styles.addGenreBtn}>
                  <PlusCircle size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Form Modal */}
      {showForm && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editId ? 'Edit Listing' : 'List a New Book'}
              </h2>
              <button onClick={closeForm} className={styles.closeBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* URL Import */}
              <div className={styles.importSection}>
                <label className={styles.label}><Link2 size={14} /> Import from Amazon / Flipkart URL</label>
                <div className={styles.importRow}>
                  <input
                    className={styles.input}
                    placeholder="https://www.amazon.in/... or https://www.flipkart.com/..."
                    value={form.importUrl}
                    onChange={e => handleChange('importUrl', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleImportUrl}
                    disabled={importing || !form.importUrl.trim()}
                    className={styles.importBtn}
                  >
                    {importing ? <Loader2 size={15} className={styles.spin} /> : <Link2 size={15} />}
                    {importing ? 'Fetching…' : 'Fetch'}
                  </button>
                </div>
                {importError && <p className={styles.importError}>{importError}</p>}
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Book Title *</label>
                  <input
                    required
                    className={styles.input}
                    placeholder="e.g. The Alchemist"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Author *</label>
                  <input
                    required
                    className={styles.input}
                    placeholder="e.g. Paulo Coelho"
                    value={form.author}
                    onChange={e => handleChange('author', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Your Selling Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    className={styles.input}
                    placeholder="e.g. 299"
                    value={form.price}
                    onChange={e => handleChange('price', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Original/Market Price (₹) — will show crossed out</label>
                  <input
                    type="number"
                    min={0}
                    className={styles.input}
                    placeholder="Auto-filled from URL or enter manually"
                    value={form.scrapedPrice}
                    onChange={e => handleChange('scrapedPrice', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Genre</label>
                  <select className={styles.select} value={form.genre} onChange={e => handleChange('genre', e.target.value)}>
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Condition</label>
                  <select className={styles.select} value={form.condition} onChange={e => handleChange('condition', e.target.value)}>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Image URL</label>
                  <input
                    className={styles.input}
                    placeholder="https://... (auto-filled from URL import, or paste manually)"
                    value={form.image}
                    onChange={e => handleChange('image', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Brief description of the book's condition, any markings, etc."
                  rows={3}
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                />
              </div>

              <div className={styles.contactNote}>
                <Instagram size={14} />
                <span>Contact for buyers will be set to <strong>instagram.com/nikkk.exe</strong> automatically.</span>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={closeForm} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>
                  {editId ? <><Check size={16} /> Save Changes</> : <><Plus size={16} /> List Book</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
