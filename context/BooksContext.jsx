import React, { createContext, useContext, useState, useEffect } from 'react'

const BooksContext = createContext()

const DEFAULT_GENRES = ['Fiction', 'Self-Help', 'History', 'Finance', 'Business', 'Science', 'Biography', 'Other']

const SEED_BOOKS = [
  {
    id: '1',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 299,
    genre: 'Fiction',
    condition: 'Like New',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg',
    description: 'A magical story about following your dreams. Lightly used, no marks.',
    contact: 'instagram.com/nikkk.exe',
    listedAt: Date.now() - 86400000 * 2,
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 499,
    genre: 'Self-Help',
    condition: 'Good',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
    description: 'Tiny changes, remarkable results. Minor highlights in a few chapters.',
    contact: 'instagram.com/nikkk.exe',
    listedAt: Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 399,
    genre: 'History',
    condition: 'Good',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg',
    description: 'A brief history of humankind. Great condition, read once.',
    contact: 'instagram.com/nikkk.exe',
    listedAt: Date.now() - 86400000 * 1,
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 349,
    genre: 'Finance',
    condition: 'Like New',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg',
    description: 'Timeless lessons on wealth, greed, and happiness. Barely used.',
    contact: 'instagram.com/nikkk.exe',
    listedAt: Date.now() - 86400000 * 3,
  },
  {
    id: '5',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    price: 249,
    genre: 'Finance',
    condition: 'Fair',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388922526i/69571.jpg',
    description: 'Classic personal finance book. Some pencil notes inside.',
    contact: 'instagram.com/nikkk.exe',
    listedAt: Date.now() - 86400000 * 7,
  },
  {
    id: '6',
    title: 'Zero to One',
    author: 'Peter Thiel',
    price: 449,
    genre: 'Business',
    condition: 'Like New',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1414347376i/18050143.jpg',
    description: 'Notes on startups and how to build the future. Perfect condition.',
    contact: 'instagram.com/nikkk.exe',
    listedAt: Date.now() - 86400000 * 4,
  },
]

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('zbooks_listings')
      return saved ? JSON.parse(saved) : SEED_BOOKS
    } catch {
      return SEED_BOOKS
    }
  })

  const [genres, setGenres] = useState(() => {
    try {
      const saved = localStorage.getItem('zbooks_genres')
      return saved ? JSON.parse(saved) : DEFAULT_GENRES
    } catch {
      return DEFAULT_GENRES
    }
  })

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('zbooks_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('zbooks_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(() => {
    return localStorage.getItem('zbooks_seller_auth') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('zbooks_listings', JSON.stringify(books))
  }, [books])

  useEffect(() => {
    localStorage.setItem('zbooks_genres', JSON.stringify(genres))
  }, [genres])

  useEffect(() => {
    localStorage.setItem('zbooks_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('zbooks_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      listedAt: Date.now(),
      contact: 'instagram.com/nikkk.exe',
    }
    setBooks(prev => [newBook, ...prev])
    return newBook
  }

  const updateBook = (id, updates) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id))
    setCart(prev => prev.filter(item => item.bookId !== id))
  }

  const addToCart = (book) => {
    setCart(prev => {
      const exists = prev.find(i => i.bookId === book.id)
      if (exists) return prev
      return [...prev, { bookId: book.id, book, addedAt: Date.now() }]
    })
  }

  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(i => i.bookId !== bookId))
  }

  const toggleWishlist = (bookId) => {
    setWishlist(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    )
  }

  const addGenre = (genre) => {
    const trimmed = genre.trim()
    if (trimmed && !genres.includes(trimmed)) {
      setGenres(prev => [...prev, trimmed])
    }
  }

  const removeGenre = (genre) => {
    setGenres(prev => prev.filter(g => g !== genre))
  }

  const sellerLogin = (username, password) => {
    if (username === 'zestyynikk' && password === 'zestyynikk08') {
      setIsSellerLoggedIn(true)
      localStorage.setItem('zbooks_seller_auth', 'true')
      return true
    }
    return false
  }

  const sellerLogout = () => {
    setIsSellerLoggedIn(false)
    localStorage.removeItem('zbooks_seller_auth')
  }

  return (
    <BooksContext.Provider value={{
      books, addBook, updateBook, deleteBook,
      cart, addToCart, removeFromCart,
      wishlist, toggleWishlist,
      genres, addGenre, removeGenre,
      isSellerLoggedIn, sellerLogin, sellerLogout,
    }}>
      {children}
    </BooksContext.Provider>
  )
}

export const useBooks = () => useContext(BooksContext)
