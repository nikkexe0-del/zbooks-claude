import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingCart, Instagram, ArrowRight, Share2, Download, Loader2 } from 'lucide-react'
import { useBooks } from '../context/BooksContext'
import styles from './Cart.module.css'

const IG = 'instagram.com/nikkk.exe'
const SITE = 'zbooks.vercel.app'

export default function Cart() {
  const { cart, removeFromCart } = useBooks()
  const [sharing, setSharing] = useState(false)
  const shareRef = useRef(null)

  const total = cart.reduce((sum, item) => sum + item.book.price, 0)

  const handleShareImage = async () => {
    setSharing(true)
    try {
      // Build canvas
      const scale = 2
      const W = 540
      const ITEM_H = 80
      const PAD = 24
      const HEADER_H = 90
      const FOOTER_H = 80
      const H = HEADER_H + PAD + cart.length * (ITEM_H + 12) + PAD + 60 + FOOTER_H
      const canvas = document.createElement('canvas')
      canvas.width = W * scale
      canvas.height = H * scale
      const ctx = canvas.getContext('2d')
      ctx.scale(scale, scale)

      // Background
      ctx.fillStyle = '#FDF8F3'
      ctx.fillRect(0, 0, W, H)

      // Header bar
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0, '#5C3D2E')
      grad.addColorStop(1, '#8B4513')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, HEADER_H)

      // Logo / site name
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 26px Georgia, serif'
      ctx.textAlign = 'left'
      ctx.fillText('📚 ZBooks', PAD, 38)
      ctx.font = '13px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.fillText(SITE, PAD, 58)

      // Cart title right side
      ctx.textAlign = 'right'
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 16px system-ui, sans-serif'
      ctx.fillText('My Reading List', W - PAD, 38)
      ctx.font = '13px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.fillText(`${cart.length} book${cart.length !== 1 ? 's' : ''}`, W - PAD, 58)

      // Items
      let y = HEADER_H + PAD
      for (const { book } of cart) {
        // Card bg
        ctx.fillStyle = '#FFFFFF'
        roundRect(ctx, PAD, y, W - PAD * 2, ITEM_H, 12)
        ctx.shadowColor = 'rgba(0,0,0,0.08)'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0

        // Try to draw image
        try {
          if (book.image) {
            const img = await loadImage(book.image)
            ctx.save()
            ctx.beginPath()
            roundRect(ctx, PAD + 12, y + 10, 44, 60, 6)
            ctx.clip()
            ctx.drawImage(img, PAD + 12, y + 10, 44, 60)
            ctx.restore()
          }
        } catch {}

        const textX = PAD + 68
        // Title
        ctx.fillStyle = '#3D2314'
        ctx.font = 'bold 14px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(truncate(book.title, 30), textX, y + 26)
        // Author
        ctx.fillStyle = '#8A6A50'
        ctx.font = '12px system-ui, sans-serif'
        ctx.fillText(book.author, textX, y + 44)
        // Genre badge
        ctx.fillStyle = '#F0E6D6'
        roundRect(ctx, textX, y + 52, ctx.measureText(book.genre || '').width + 14, 18, 9)
        ctx.fill()
        ctx.fillStyle = '#8B4513'
        ctx.font = '10px system-ui, sans-serif'
        ctx.fillText(book.genre || '', textX + 7, y + 65)

        // Price
        ctx.textAlign = 'right'
        ctx.fillStyle = '#5C3D2E'
        ctx.font = 'bold 16px system-ui, sans-serif'
        ctx.fillText(`₹${book.price}`, W - PAD - 12, y + 36)
        ctx.fillStyle = '#A07850'
        ctx.font = '11px system-ui, sans-serif'
        ctx.fillText(book.condition, W - PAD - 12, y + 54)

        y += ITEM_H + 12
      }

      // Total row
      y += 4
      ctx.fillStyle = '#5C3D2E'
      ctx.font = 'bold 16px system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('Total', PAD, y + 20)
      ctx.textAlign = 'right'
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillStyle = '#8B4513'
      ctx.fillText(`₹${total.toLocaleString()}`, W - PAD, y + 20)

      // Divider
      ctx.strokeStyle = '#E8D8C0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, y + 32)
      ctx.lineTo(W - PAD, y + 32)
      ctx.stroke()

      // Footer
      const fY = H - FOOTER_H + 16
      ctx.fillStyle = '#8B4513'
      ctx.font = 'bold 13px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`📸 @${IG}  •  DM to buy`, W / 2, fY + 16)
      ctx.fillStyle = '#A07850'
      ctx.font = '12px system-ui, sans-serif'
      ctx.fillText(SITE, W / 2, fY + 36)

      // Bottom accent bar
      ctx.fillStyle = grad
      ctx.fillRect(0, H - 6, W, 6)

      // Download
      const link = document.createElement('a')
      link.download = 'zbooks-cart.jpg'
      link.href = canvas.toDataURL('image/jpeg', 0.92)
      link.click()
    } catch (err) {
      console.error(err)
      alert('Could not generate image. Try again.')
    }
    setSharing(false)
  }

  if (cart.length === 0) return (
    <div className={styles.empty}>
      <span>🛒</span>
      <h2>Your cart is empty</h2>
      <p>Browse books and add them to your cart</p>
      <Link to="/" className="btn-primary">Browse Books</Link>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <ShoppingCart size={28} />
          Your Cart
          <span className={styles.count}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
        </h1>

        <div className={styles.layout}>
          <div className={styles.items}>
            {cart.map(({ bookId, book }) => (
              <div key={bookId} className={styles.item}>
                <Link to={`/book/${book.id}`} className={styles.itemImage}>
                  {book.image ? (
                    <img src={book.image} alt={book.title} onError={e => e.target.style.display='none'} />
                  ) : (
                    <span>📚</span>
                  )}
                </Link>
                <div className={styles.itemInfo}>
                  <Link to={`/book/${book.id}`} className={styles.itemTitle}>{book.title}</Link>
                  <p className={styles.itemAuthor}>{book.author}</p>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemGenre}>{book.genre}</span>
                    <span className={styles.itemCond}>{book.condition}</span>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <span className={styles.itemPrice}>₹{book.price}</span>
                  <div className={styles.itemBtns}>
                    <a
                      href={`https://${book.contact}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.igBtn}
                    >
                      <Instagram size={14} />
                      DM to Buy
                    </a>
                    <button onClick={() => removeFromCart(bookId)} className={styles.removeBtn} title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryRows}>
              {cart.map(({ bookId, book }) => (
                <div key={bookId} className={styles.summaryRow}>
                  <span className={styles.summaryBook}>{book.title}</span>
                  <span>₹{book.price}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className={styles.summaryNote}>
              <p>To complete purchase, DM the seller on Instagram for each book to arrange payment & pickup.</p>
            </div>

            {/* Share as Image Button */}
            <button
              onClick={handleShareImage}
              disabled={sharing}
              className={styles.shareImageBtn}
            >
              {sharing ? <Loader2 size={18} className={styles.spin} /> : <Share2 size={18} />}
              {sharing ? 'Generating…' : 'Share Cart as Image'}
              {!sharing && <Download size={14} />}
            </button>

            <a
              href={`https://instagram.com/nikkk.exe`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.checkoutBtn}
            >
              <Instagram size={18} />
              Contact Seller on Instagram
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}
