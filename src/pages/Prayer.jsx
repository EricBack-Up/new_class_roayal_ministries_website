import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  Heart, 
  Users, 
  Clock, 
  MessageSquare,
  Send,
  Filter,
  Search,
  Plus,
  Star,
  Calendar
} from 'lucide-react'

// Components
import PageHeader from '../components/common/PageHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Hooks
import { 
  usePrayerRequests, 
  useCreatePrayerRequest, 
  usePrayForRequest,
  useApiQuery 
} from '../hooks/useApi'
import { apiService } from '../services/api'

const Prayer = () => {
  const [activeTab, setActiveTab] = useState('requests')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data: prayerRequests, isLoading: requestsLoading } = usePrayerRequests()
  const { data: categories } = useApiQuery('prayerCategories', apiService.getPrayerCategories)
  const createPrayerMutation = useCreatePrayerRequest()
  const prayForRequestMutation = usePrayForRequest()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmitPrayerRequest = async (data) => {
    try {
      await createPrayerMutation.mutateAsync(data)
      reset()
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating prayer request:', error)
    }
  }

  const handlePrayForRequest = async (requestId) => {
    try {
      await prayForRequestMutation.mutateAsync({
        id: requestId,
        data: { prayed_by_name: 'Anonymous', is_anonymous: true }
      })
    } catch (error) {
      console.error('Error praying for request:', error)
    }
  }

  const filteredRequests = prayerRequests?.data?.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || request.category?.name === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="Prayer Ministry"
        subtitle="Join our community in prayer. Submit your requests and pray for others in need."
        backgroundImage="https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      />

      {/* Prayer Stats */}
      <section className="py-12 bg-gradient-to-r from-royal-50 to-royal-100">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-royal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Active Prayers</h3>
              <p className="text-gray-600">Join others in lifting up these requests</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">Believers praying together in unity</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Answered Prayers</h3>
              <p className="text-gray-600">Testimonies of God's faithfulness</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4 sm:mb-0">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-white text-royal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Prayer Requests
              </button>
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'submit'
                    ? 'bg-white text-royal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Submit Request
              </button>
            </div>

            {activeTab === 'requests' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Prayer Request
              </button>
            )}
          </div>

          {/* Prayer Requests Tab */}
          {activeTab === 'requests' && (
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search prayer requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
                  >
                    <option value="">All Categories</option>
                    {categories?.data?.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prayer Requests List */}
              {requestsLoading ? (
                <LoadingSpinner text="Loading prayer requests..." />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="card p-6 hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {request.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            by {request.requester_display_name}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[request.urgency]}`}>
                            {request.urgency}
                          </span>
                          {request.category && (
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: request.category.color }}
                            >
                              {request.category.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {request.request_text}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(request.created_at)}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {request.prayer_count} prayers
                          </div>
                        </div>

                        <button
                          onClick={() => handlePrayForRequest(request.id)}
                          disabled={prayForRequestMutation.isLoading}
                          className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Pray
                        </button>
                      </div>

                      {request.is_answered && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center text-green-800 font-medium mb-1">
                            <Star className="w-4 h-4 mr-1" />
                            Prayer Answered
                          </div>
                          {request.answer_description && (
                            <p className="text-green-700 text-sm">
                              {request.answer_description}
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredRequests.length === 0 && !requestsLoading && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No prayer requests found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || selectedCategory 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Be the first to submit a prayer request.'
                    }
                  </p>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="btn-primary"
                  >
                    Submit Prayer Request
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Request Tab */}
          {activeTab === 'submit' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="card p-8">
                <div className="text-center mb-8">
                  <Heart className="w-12 h-12 text-royal-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Prayer Request</h2>
                  <p className="text-gray-600">
                    Share your prayer needs with our community. We believe in the power of prayer.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitPrayerRequest)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        {...register('category')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {categories?.data?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency
                      </label>
                      <select
                        {...register('urgency')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                      >
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prayer Request Title *
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                      placeholder="Brief title for your prayer request"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prayer Request Details *
                    </label>
                    <textarea
                      rows={6}
                      {...register('request_text', { 
                        required: 'Prayer request details are required',
                        minLength: { value: 10, message: 'Please provide more details (at least 10 characters)' }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent resize-none"
                      placeholder="Please share your prayer request in detail..."
                    />
                    {errors.request_text && (
                      <p className="mt-1 text-sm text-red-600">{errors.request_text.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('is_public')}
                        className="w-4 h-4 text-royal-600 border-gray-300 rounded focus:ring-royal-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Make this prayer request public (others can see and pray for it)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('is_anonymous')}
                        className="w-4 h-4 text-royal-600 border-gray-300 rounded focus:ring-royal-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Submit anonymously (your name will not be shown)
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={createPrayerMutation.isLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {createPrayerMutation.isLoading ? (
                      <div className="loading-spinner w-5 h-5 mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {createPrayerMutation.isLoading ? 'Submitting...' : 'Submit Prayer Request'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Prayer Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">New Prayer Request</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmitPrayerRequest)} className="space-y-4">
                {/* Form content similar to submit tab but in modal format */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prayer Request Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                    placeholder="Brief title for your prayer request"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prayer Request Details *
                  </label>
                  <textarea
                    rows={4}
                    {...register('request_text', { 
                      required: 'Prayer request details are required',
                      minLength: { value: 10, message: 'Please provide more details (at least 10 characters)' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent resize-none"
                    placeholder="Please share your prayer request in detail..."
                  />
                  {errors.request_text && (
                    <p className="mt-1 text-sm text-red-600">{errors.request_text.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPrayerMutation.isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createPrayerMutation.isLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Call to Action */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">The Power of Prayer</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              "Therefore confess your sins to each other and pray for each other so that you may be healed. 
              The prayer of a righteous person is powerful and effective." - James 5:16
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => setActiveTab('submit')}
                className="btn-outline"
              >
                Submit Prayer Request
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className="btn-outline"
              >
                <Heart className="w-5 h-5 mr-2" />
                Pray for Others
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Prayer