import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Store, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import styles from './SellerLogin.module.css'

export default function SellerLogin() {
  const { sellerLogin, isSellerLoggedIn } = useBooks()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (isSellerLoggedIn) {
    navigate('/seller')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const ok = sellerLogin(username.trim(), password)
    if (ok) {
      navigate('/seller')
    } else {
      setError('Invalid username or password.')
    }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <Store size={28} />
          </div>
          <h1 className={styles.title}>Seller Login</h1>
          <p className={styles.subtitle}>Access your seller dashboard to list and manage books.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <div className={styles.inputWrap}>
              <User size={16} className={styles.inputIcon} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                className={styles.input}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className={styles.input}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={styles.eyeBtn}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <Store size={16} />
                Sign In to Seller Dashboard
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/" className={styles.backLink}>← Back to Store</Link>
        </div>
      </div>
    </div>
  )
}
