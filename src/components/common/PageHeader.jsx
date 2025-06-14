import React from 'react'
import { motion } from 'framer-motion'

const PageHeader = ({ 
  title, 
  subtitle, 
  backgroundImage = 'https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  children 
}) => {
  return (
    <div className="relative h-64 lg:h-80 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-royal-800/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-6xl font-bold mb-4"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
        
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PageHeader