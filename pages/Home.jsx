import React, { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, ArrowUpDown, BookOpen, Sparkles } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import BookCard from '../components/BookCard'
import styles from './Home.module.css'

const CONDITIONS = ['All', 'Like New', 'Good', 'Fair']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export default function Home() {
  const { books, genres } = useBooks()
  const [searchParams] = useSearchParams()
  const [condition, setCondition] = useState('All')
  const [sort, setSort] = useState('newest')
  const [maxPrice, setMaxPrice] = useState(2000)

  const searchQuery = searchParams.get('search') || ''
  const genreParam = searchParams.get('genre') || 'All'

  const ALL_GENRES = ['All', ...genres]

  const filtered = useMemo(() => {
    let result = [...books]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre?.toLowerCase().includes(q)
      )
    }

    if (genreParam && genreParam !== 'All') {
      result = result.filter(b => b.genre === genreParam)
    }

    if (condition !== 'All') {
      result = result.filter(b => b.condition === condition)
    }

    result = result.filter(b => b.price <= maxPrice)

    if (sort === 'newest') result.sort((a, b) => b.listedAt - a.listedAt)
    else if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    else if (sort === 'price-high') result.sort((a, b) => b.price - a.price)

    return result
  }, [books, searchQuery, genreParam, condition, sort, maxPrice])

  const activeGenre = genreParam || 'All'

  return (
    <div className={styles.page}>
      {/* Hero */}
      {!searchQuery && activeGenre === 'All' && (
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Find Your Next<br />
                <em>Great Read</em>
              </h1>
              <p className={styles.heroDesc}>
                Browse hundreds of pre-loved books at unbeatable prices. Contact directly on Instagram to buy & pickup.
              </p>
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <strong>{books.length}+</strong>
                  <span>Books Listed</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <strong>₹0+</strong>
                  <span>Starting Price</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <strong>DM</strong>
                  <span>to Buy</span>
                </div>
              </div>
            </div>
            <div className={styles.heroDecor}>
              <div className={styles.heroBookStack}>
                <div className={styles.heroBook} style={{ background: '#8B4513', transform: 'rotate(-8deg) translateY(10px)' }} />
                <div className={styles.heroBook} style={{ background: '#5C3D2E', transform: 'rotate(-3deg) translateY(4px)' }} />
                <div className={styles.heroBook} style={{ background: '#C8813A', transform: 'rotate(4deg)' }} />
                <div className={styles.heroBook} style={{ background: '#7A5C48', transform: 'rotate(10deg) translateY(8px)' }} />
              </div>
              <span className={styles.heroEmoji}>📚</span>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className={styles.container}>
        {(searchQuery || activeGenre !== 'All') && (
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>
              {searchQuery ? `Results for "${searchQuery}"` : activeGenre}
            </h2>
            <p className={styles.pageCount}>{filtered.length} books found</p>
          </div>
        )}

        <div className={styles.layout}>
          {/* Sidebar filters */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <h3 className={styles.filterTitle}>
                <SlidersHorizontal size={16} />
                Filters
              </h3>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Condition</label>
                <div className={styles.filterOptions}>
                  {CONDITIONS.map(c => (
                    <button
                      key={c}
                      className={`${styles.filterOption} ${condition === c ? styles.filterActive : ''}`}
                      onClick={() => setCondition(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Max Price: ₹{maxPrice}</label>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className={styles.priceSlider}
                />
                <div className={styles.sliderLabels}>
                  <span>₹0</span>
                  <span>₹2000</span>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Genre</label>
                <div className={styles.genreList}>
                  {ALL_GENRES.map(g => (
                    <Link
                      key={g}
                      to={g === 'All' ? '/' : `/?genre=${encodeURIComponent(g)}`}
                      className={`${styles.genreLink} ${activeGenre === g ? styles.genreActive : ''}`}
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className={styles.main}>
            {/* Sort bar */}
            <div className={styles.sortBar}>
              <span className={styles.resultsCount}>
                <BookOpen size={15} />
                {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
              </span>
              <div className={styles.sortSelect}>
                <ArrowUpDown size={14} />
                <select value={sort} onChange={e => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <h3>No books found</h3>
                <p>Try different search terms or filters</p>
                <Link to="/" className="btn-primary">Browse All Books</Link>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map((book, i) => (
                  <BookCard key={book.id} book={book} delay={i * 50} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
