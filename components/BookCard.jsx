import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Instagram, Star } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import styles from './BookCard.module.css'

const CONDITION_COLORS = {
  'Like New': { bg: '#E8F5E8', color: '#4A7C4A' },
  'Good':     { bg: '#FFF3E0', color: '#8A5C2A' },
  'Fair':     { bg: '#FFF8E1', color: '#7A6020' },
}

export default function BookCard({ book, delay = 0 }) {
  const { addToCart, toggleWishlist, wishlist } = useBooks()
  const [imgError, setImgError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const isWishlisted = wishlist.includes(book.id)
  const conditionStyle = CONDITION_COLORS[book.condition] || CONDITION_COLORS['Good']

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(book)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(book.id)
  }

  return (
    <Link to={`/book/${book.id}`} className={styles.card} style={{ animationDelay: `${delay}ms` }}>
      {/* Image */}
      <div className={styles.imageWrap}>
        {imgError || !book.image ? (
          <div className={styles.imageFallback}>
            <span>📚</span>
            <span className={styles.fallbackTitle}>{book.title}</span>
          </div>
        ) : (
          <img
            src={book.image}
            alt={book.title}
            onError={() => setImgError(true)}
            className={styles.image}
          />
        )}
        <button
          className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={handleWishlist}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <div className={styles.genreTag}>{book.genre}</div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>

        <div className={styles.meta}>
          <span
            className={styles.condition}
            style={{ background: conditionStyle.bg, color: conditionStyle.color }}
          >
            {book.condition}
          </span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>₹{book.price}</span>
          <span className={styles.originalPrice}>₹{Math.round(book.price * 2.5)}</span>
          <span className={styles.discount}>{Math.round((1 - 1/2.5)*100)}% off</span>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.cartBtn} ${addedToCart ? styles.cartAdded : ''}`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
            {addedToCart ? 'Added!' : 'Add to Cart'}
          </button>
          <a
            href={`https://${book.contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.igBtn}
            onClick={e => e.stopPropagation()}
          >
            <Instagram size={14} />
            Buy
          </a>
        </div>
      </div>
    </Link>
  )
}
