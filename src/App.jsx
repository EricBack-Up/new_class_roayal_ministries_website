import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Ministries from './pages/Ministries.jsx'
import Sermons from './pages/Sermons'
import SermonDetail from './pages/SermonDetail'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Prayer from './pages/Prayer'
import Donations from './pages/Donations'
import Contact from './pages/Contact'
import LiveStream from './pages/LiveStream'
import Newsletter from './pages/Newsletter'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/sermons/:id" element={<SermonDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/live" element={<LiveStream />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AnimatePresence>
      
      <Footer />
    </div>
  )
}

export default App