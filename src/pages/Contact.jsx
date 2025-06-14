import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react'

// Components
import PageHeader from '../components/common/PageHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Hooks
import { useChurchInfo, useContactMessage } from '../hooks/useApi'

const Contact = () => {
  const { data: churchInfo, isLoading: churchLoading } = useChurchInfo()
  const contactMutation = useContactMessage()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await contactMutation.mutateAsync(data)
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (churchLoading) return <LoadingSpinner size="lg" text="Loading contact information..." />

  const church = churchInfo?.data

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: church?.address || 'Lilanda West, Lusaka, Zambia',
      color: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: (
        <div>
          <div>{church?.phone || '+260 975 639 834'}</div>
          {church?.phone_secondary && <div>{church.phone_secondary}</div>}
        </div>
      ),
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: church?.email || 'newclassroyalministries@gmail.com',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Service Times',
      content: (
        <div>
          <div><strong>Sunday:</strong> {church?.sunday_service_time || '09:00 AM - 12:00 PM'}</div>
          <div><strong>Wednesday:</strong> {church?.wednesday_service_time || '06:00 PM - 08:00 PM'}</div>
        </div>
      ),
      color: 'text-orange-600'
    }
  ]

  const messageTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'prayer', label: 'Prayer Request' },
    { value: 'counseling', label: 'Counseling Request' },
    { value: 'training', label: 'Training Inquiry' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'support', label: 'Support Request' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with us. We'd love to hear from you and answer any questions you may have."
        backgroundImage="https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      />

      {/* Contact Information */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you have questions about our ministries, need prayer, or want to get involved, 
              we're here to help and would love to connect with you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center group hover:shadow-xl"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${info.color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:${info.color.replace('text-', 'bg-').replace('-600', '-600')} transition-colors`}>
                  <info.icon className={`w-8 h-8 ${info.color} group-hover:text-white transition-colors`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="text-gray-600">{info.content}</div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card p-8"
            >
              <div className="flex items-center mb-6">
                <MessageSquare className="w-6 h-6 text-royal-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Send us a Message</h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-colors"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Type
                    </label>
                    <select
                      {...register('message_type')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-colors"
                    >
                      {messageTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-colors"
                    placeholder="Brief subject of your message"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="loading-spinner w-5 h-5 mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Find Us</h3>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive map coming soon</p>
                    <p className="text-sm mt-1">Lilanda West, Lusaka, Zambia</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Us</h3>
                <p className="text-gray-600 mb-6">
                  Follow us on social media for updates, inspiration, and community news.
                </p>
                
                <div className="flex space-x-4">
                  {church?.facebook_url && (
                    <a
                      href={church.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                  )}
                  {church?.instagram_url && (
                    <a
                      href={church.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-pink-100 hover:bg-pink-600 text-pink-600 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                  {church?.youtube_url && (
                    <a
                      href={church.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Youtube className="w-6 h-6" />
                    </a>
                  )}
                  {church?.twitter_url && (
                    <a
                      href={church.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-100 hover:bg-blue-400 text-blue-400 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="card p-6 bg-gradient-to-br from-royal-50 to-royal-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                <p className="text-gray-600 mb-4">
                  For urgent prayer requests or immediate assistance, you can reach us directly:
                </p>
                
                <div className="space-y-3">
                  <a
                    href={`tel:${church?.phone || '+260975639834'}`}
                    className="flex items-center text-royal-600 hover:text-royal-700 font-medium"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {church?.phone || '+260 975 639 834'}
                  </a>
                  
                  <a
                    href={`mailto:${church?.email || 'newclassroyalministries@gmail.com'}`}
                    className="flex items-center text-royal-600 hover:text-royal-700 font-medium"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {church?.email || 'newclassroyalministries@gmail.com'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Contact