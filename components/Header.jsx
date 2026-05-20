import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, Search, BookOpen, Store, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import styles from './Header.module.css'

export default function Header() {
  const { cart, wishlist, isSellerLoggedIn, sellerLogout } = useBooks()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className={styles.header}>
      {/* Top strip */}
      <div className={styles.topStrip}>
        <span>📚 Free contact pickup in Mysore — DM on Instagram</span>
      </div>

      {/* Main nav */}
      <div className={styles.mainNav}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>z</div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>zBooks</span>
            <span className={styles.logoTagline}>your neighbourhood bookstore</span>
          </div>
        </Link>

        {/* Search */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books, authors, genres..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            <Search size={18} />
          </button>
        </form>

        {/* Nav Actions */}
        <div className={styles.navActions}>
          <Link to="/wishlist" className={styles.iconBtn} title="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span className={styles.badge}>{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className={styles.iconBtn} title="Cart">
            <ShoppingCart size={20} />
            {cart.length > 0 && <span className={styles.badge}>{cart.length}</span>}
          </Link>
          {isSellerLoggedIn ? (
            <div className={styles.sellerActions}>
              <Link to="/seller" className={`${styles.sellerBtn} ${isActive('/seller') ? styles.active : ''}`}>
                <Store size={16} />
                Seller
              </Link>
              <button onClick={sellerLogout} className={styles.logoutBtn} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/seller-login" className={styles.sellerLoginBtn}>
              <Store size={16} />
              Sell Books
            </Link>
          )}
          <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className={styles.categoryNav}>
        <Link to="/" className={`${styles.catLink} ${isActive('/') ? styles.catActive : ''}`}>All Books</Link>
        {['Fiction', 'Self-Help', 'History', 'Finance', 'Business', 'Science', 'Biography'].map(g => (
          <Link key={g} to={`/?genre=${encodeURIComponent(g)}`} className={styles.catLink}>{g}</Link>
        ))}
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <form onSubmit={handleSearch} className={styles.mobileSearch}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}><Search size={18} /></button>
          </form>
          <div className={styles.mobileLinks}>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>❤️ Wishlist ({wishlist.length})</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>🛒 Cart ({cart.length})</Link>
            {isSellerLoggedIn
              ? <Link to="/seller" onClick={() => setMobileMenuOpen(false)}>🏪 Seller Dashboard</Link>
              : <Link to="/seller-login" onClick={() => setMobileMenuOpen(false)}>🏪 Sell Books</Link>
            }
          </div>
        </div>
      )}
    </header>
  )
}
