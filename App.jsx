import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BooksProvider } from './context/BooksContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import SellerLogin from './pages/SellerLogin'
import SellerDashboard from './pages/SellerDashboard'

export default function App() {
  return (
    <BooksProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/seller" element={<SellerDashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </BooksProvider>
  )
}
