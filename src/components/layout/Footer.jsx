import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  Heart,
  ArrowUp
} from 'lucide-react'
import { useChurchInfo } from '../../hooks/useApi'

const Footer = () => {
  const { data: churchInfo } = useChurchInfo()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Ministries', href: '/ministries' },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Events', href: '/events' },
    { name: 'Prayer Requests', href: '/prayer' },
    { name: 'Contact', href: '/contact' },
  ]

  const ministries = [
    { name: 'REACTS College', href: '/ministries#reacts' },
    { name: 'Community Health', href: '/ministries#health' },
    { name: 'Trauma Healing', href: '/ministries#healing' },
    { name: 'Alcohol & Drug Prevention', href: '/ministries#prevention' },
    { name: 'GROW Ministry', href: '/ministries#grow' },
  ]

  const resources = [
    { name: 'Live Stream', href: '/live' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Donations', href: '/donations' },
    { name: 'Event Registration', href: '/events' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Church Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">New Class Royal Ministries</h3>
                <p className="text-gray-400 text-sm">Called for Community Influence</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              A holistic ministry addressing the spiritual, mental, and physical well-being 
              of individuals and communities in Zambia and beyond.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-royal-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {churchInfo?.data?.address || 'Lilanda West, Lusaka, Zambia'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-royal-400 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>{churchInfo?.data?.phone || '+260 975 639 834'}</div>
                  {churchInfo?.data?.phone_secondary && (
                    <div>{churchInfo.data.phone_secondary}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-royal-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {churchInfo?.data?.email || 'newclassroyalministries@gmail.com'}
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              {churchInfo?.data?.facebook_url && (
                <a
                  href={churchInfo.data.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-royal-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {churchInfo?.data?.instagram_url && (
                <a
                  href={churchInfo.data.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-royal-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {churchInfo?.data?.youtube_url && (
                <a
                  href={churchInfo.data.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-royal-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {churchInfo?.data?.twitter_url && (
                <a
                  href={churchInfo.data.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-royal-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-royal-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Our Ministries</h4>
            <ul className="space-y-3">
              {ministries.map((ministry) => (
                <li key={ministry.name}>
                  <Link
                    to={ministry.href}
                    className="text-gray-300 hover:text-royal-400 transition-colors text-sm"
                  >
                    {ministry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    to={resource.href}
                    className="text-gray-300 hover:text-royal-400 transition-colors text-sm"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Service Times */}
            <div className="mt-8">
              <h5 className="font-semibold mb-3">Service Times</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <span className="font-medium">Sunday:</span> {churchInfo?.data?.sunday_service_time || '09:00 AM - 12:00 PM'}
                </div>
                <div>
                  <span className="font-medium">Wednesday:</span> {churchInfo?.data?.wednesday_service_time || '06:00 PM - 08:00 PM'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-max py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>&copy; 2024 New Class Royal Ministries.</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for Community Influence</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-royal-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-royal-400 transition-colors">
                Terms of Service
              </Link>
              
              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-royal-600 hover:bg-royal-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer