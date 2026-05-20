import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import BookCard from '../components/BookCard'
import styles from './Wishlist.module.css'

export default function Wishlist() {
  const { books, wishlist } = useBooks()
  const wishlisted = books.filter(b => wishlist.includes(b.id))

  if (wishlisted.length === 0) return (
    <div className={styles.empty}>
      <span>❤️</span>
      <h2>Your wishlist is empty</h2>
      <p>Heart books you love to save them here</p>
      <Link to="/" className="btn-primary">Browse Books</Link>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <Heart size={28} fill="currentColor" style={{ color: '#C0453A' }} />
          Wishlist
          <span className={styles.count}>{wishlisted.length} book{wishlisted.length !== 1 ? 's' : ''}</span>
        </h1>
        <div className={styles.grid}>
          {wishlisted.map((book, i) => (
            <BookCard key={book.id} book={book} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  )
}
