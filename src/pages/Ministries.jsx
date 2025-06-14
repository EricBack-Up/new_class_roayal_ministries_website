import React from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/common/PageHeader'

function Ministries() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader 
        title="Our Ministries" 
        subtitle="Serving our community through various ministries and programs"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ministry cards will be added here */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Youth Ministry</h3>
            <p className="text-gray-600">
              Empowering young people to grow in faith and serve their community.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Women's Ministry</h3>
            <p className="text-gray-600">
              Building strong relationships and supporting women in their spiritual journey.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Men's Ministry</h3>
            <p className="text-gray-600">
              Encouraging men to be leaders in their families and communities.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Ministries