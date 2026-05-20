import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingCart, Instagram, MapPin, User, Clock, Tag } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import styles from './BookDetail.module.css'

const CONDITION_INFO = {
  'Like New': { color: '#4A7C4A', bg: '#E8F5E8', desc: 'Virtually no signs of use. Near perfect condition.' },
  'Good':     { color: '#8A5C2A', bg: '#FFF3E0', desc: 'Minor wear. Clean pages, intact spine.' },
  'Fair':     { color: '#7A6020', bg: '#FFF8E1', desc: 'Visible signs of use. All text remains readable.' },
}

export default function BookDetail() {
  const { id } = useParams()
  const { books, addToCart, toggleWishlist, wishlist } = useBooks()
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()

  const book = books.find(b => b.id === id)

  if (!book) return (
    <div className={styles.notFound}>
      <span>📚</span>
      <h2>Book not found</h2>
      <Link to="/" className="btn-primary">Back to Store</Link>
    </div>
  )

  const isWishlisted = wishlist.includes(book.id)
  const cond = CONDITION_INFO[book.condition] || CONDITION_INFO['Good']

  const handleCart = () => {
    addToCart(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const originalPrice = book.scrapedPrice || Math.round(book.price * 2.5)
  const discount = Math.round((1 - book.price / originalPrice) * 100)
  const timeAgo = () => {
    const diff = Date.now() - book.listedAt
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back */}
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className={styles.layout}>
          {/* Image panel */}
          <div className={styles.imagePanel}>
            <div className={styles.imageWrap}>
              {imgError || !book.image ? (
                <div className={styles.imageFallback}>
                  <span>📚</span>
                  <span>{book.title}</span>
                </div>
              ) : (
                <img src={book.image} alt={book.title} onError={() => setImgError(true)} className={styles.image} />
              )}
            </div>
            <div className={styles.imageActions}>
              <button
                onClick={() => toggleWishlist(book.id)}
                className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          {/* Info panel */}
          <div className={styles.infoPanel}>
            <div className={styles.genreTag}>{book.genre}</div>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.author}>by <strong>{book.author}</strong></p>

            {/* Price */}
            <div className={styles.priceSection}>
              {book.scrapedPrice ? (
                <>
                  <span className={styles.originalPrice} style={{fontSize:'18px',textDecoration:'line-through'}}>₹{book.scrapedPrice}</span>
                  <a href="https://instagram.com/nikkk.exe" target="_blank" rel="noopener noreferrer" className={styles.price} style={{textDecoration:'none',cursor:'pointer'}}>DM for Price</a>
                </>
              ) : (
                <span className={styles.price}>₹{book.price}</span>
              )}
              {!book.scrapedPrice && <span className={styles.originalPrice}>₹{originalPrice}</span>}
              <span className={styles.discount}>{discount}% off</span>
            </div>

            {/* Condition */}
            <div className={styles.conditionBox} style={{ background: cond.bg, borderColor: cond.color + '40' }}>
              <div className={styles.conditionTop}>
                <span className={styles.conditionLabel} style={{ color: cond.color }}>
                  Condition: {book.condition}
                </span>
              </div>
              <p className={styles.conditionDesc}>{cond.desc}</p>
            </div>

            {/* Description */}
            {book.description && (
              <div className={styles.descSection}>
                <h3 className={styles.sectionTitle}>About this copy</h3>
                <p className={styles.desc}>{book.description}</p>
              </div>
            )}

            {/* Meta */}
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <Clock size={14} />
                <span>Listed {timeAgo()}</span>
              </div>
              <div className={styles.metaItem}>
                <Tag size={14} />
                <span>{book.genre}</span>
              </div>
              <div className={styles.metaItem}>
                <MapPin size={14} />
                <span>Mysore, Karnataka</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
              <button
                onClick={handleCart}
                className={`${styles.cartBtn} ${added ? styles.cartAdded : ''}`}
              >
                <ShoppingCart size={18} />
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>

              <a
                href={`https://${book.contact}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyBtn}
              >
                <Instagram size={18} />
                DM to Buy Now
              </a>
            </div>

            {/* Contact box */}
            <div className={styles.contactBox}>
              <div className={styles.contactHeader}>
                <User size={16} />
                <span>Contact Seller</span>
              </div>
              <p className={styles.contactText}>
                Message on Instagram to arrange pickup or delivery in Mysore.
              </p>
              <a
                href={`https://${book.contact}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <Instagram size={15} />
                {book.contact}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
