import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  ChevronDown, 
  Heart, 
  Calendar, 
  BookOpen, 
  Users, 
  Phone,
  Play,
  Mail
} from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Ministries', 
      href: '/ministries',
      dropdown: [
        { name: 'All Ministries', href: '/ministries', icon: Users },
        { name: 'REACTS College', href: '/ministries#reacts', icon: BookOpen },
        { name: 'Community Health', href: '/ministries#health', icon: Heart },
        { name: 'Trauma Healing', href: '/ministries#healing', icon: Heart },
      ]
    },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Events', href: '/events' },
    { name: 'Prayer', href: '/prayer' },
    { name: 'Live', href: '/live', icon: Play },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container-max">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">N</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`font-bold text-lg lg:text-xl ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                New Class Royal Ministries
              </h1>
              <p className={`text-xs lg:text-sm ${
                isScrolled ? 'text-gray-600' : 'text-gray-200'
              }`}>
                Called for Community Influence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? isScrolled
                            ? 'text-royal-600 bg-royal-50'
                            : 'text-gold-400 bg-white/10'
                          : isScrolled
                            ? 'text-gray-700 hover:text-royal-600 hover:bg-gray-50'
                            : 'text-white hover:text-gold-400 hover:bg-white/10'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                    
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-royal-600 hover:bg-gray-50 transition-colors"
                            >
                              {dropdownItem.icon && <dropdownItem.icon className="w-4 h-4" />}
                              <span>{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? isScrolled
                          ? 'text-royal-600 bg-royal-50'
                          : 'text-gold-400 bg-white/10'
                        : isScrolled
                          ? 'text-gray-700 hover:text-royal-600 hover:bg-gray-50'
                          : 'text-white hover:text-gold-400 hover:bg-white/10'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 ml-6">
              <Link
                to="/donations"
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isScrolled
                    ? 'bg-royal-600 hover:bg-royal-700 text-white'
                    : 'bg-gold-500 hover:bg-gold-600 text-white'
                }`}
              >
                Donate
              </Link>
              <Link
                to="/newsletter"
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-royal-600 hover:bg-gray-50'
                    : 'text-white hover:text-gold-400 hover:bg-white/10'
                }`}
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-royal-600 bg-royal-50'
                          : 'text-gray-700 hover:text-royal-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.name}</span>
                    </Link>
                    
                    {item.dropdown && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:text-royal-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {dropdownItem.icon && <dropdownItem.icon className="w-4 h-4" />}
                            <span>{dropdownItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile CTA Buttons */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Link
                    to="/donations"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-royal-600 hover:bg-royal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Donate Now
                  </Link>
                  <Link
                    to="/newsletter"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center border-2 border-royal-600 text-royal-600 hover:bg-royal-600 hover:text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Newsletter
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar