import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, BookOpen, Heart } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}>z</div>
              <span className={styles.logoName}>zBooks</span>
            </div>
            <p className={styles.tagline}>
              Your neighbourhood secondhand bookstore. Buy, sell, and share the love of reading across Mysore.
            </p>
            <a
              href="https://instagram.com/nikkk.exe"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igLink}
            >
              <Instagram size={16} />
              @nikkk.exe
            </a>
          </div>

          {/* Links */}
          <div className={styles.linksCol}>
            <h4>Browse</h4>
            <Link to="/">All Books</Link>
            <Link to="/?genre=Fiction">Fiction</Link>
            <Link to="/?genre=Self-Help">Self-Help</Link>
            <Link to="/?genre=Finance">Finance</Link>
            <Link to="/?genre=Business">Business</Link>
          </div>

          <div className={styles.linksCol}>
            <h4>Account</h4>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/seller-login">Seller Login</Link>
            <Link to="/seller">Seller Dashboard</Link>
          </div>

          <div className={styles.linksCol}>
            <h4>Contact & Buy</h4>
            <p className={styles.contactInfo}>
              To buy any book or schedule a pickup, DM us on Instagram:
            </p>
            <a
              href="https://instagram.com/nikkk.exe"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igBtn}
            >
              <Instagram size={15} />
              instagram.com/nikkk.exe
            </a>
            <p className={styles.contactInfo} style={{ marginTop: 8 }}>
              📍 Mysore, Karnataka
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <span>© {new Date().getFullYear()} zBooks. All rights reserved.</span>
          </div>
          <div className={styles.credit}>
            <span>Developed & maintained with</span>
            <Heart size={13} fill="currentColor" />
            <span>by</span>
            <a
              href="https://instagram.com/nikkk.exe"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nikshep Doggalli
            </a>
            <span>·</span>
            <a
              href="https://instagram.com/nikkk.exe"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igSmall}
            >
              <Instagram size={13} />
              @nikkk.exe
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
