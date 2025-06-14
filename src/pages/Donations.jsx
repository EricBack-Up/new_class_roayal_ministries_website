import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  Heart, 
  Target, 
  Users, 
  DollarSign, 
  CreditCard,
  Shield,
  CheckCircle,
  TrendingUp,
  Gift,
  Church,
  BookOpen,
  Globe
} from 'lucide-react'

// Components
import PageHeader from '../components/common/PageHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Hooks
import { useApiQuery } from '../hooks/useApi'
import { apiService } from '../services/api'

const Donations = () => {
  const [selectedAmount, setSelectedAmount] = useState('')
  const [donationType, setDonationType] = useState('offering')
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: campaigns, isLoading: campaignsLoading } = useApiQuery(
    'donationCampaigns', 
    apiService.getDonationCampaigns
  )

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      amount: '',
      donor_name: '',
      donor_email: '',
      donor_phone: '',
      donation_type: 'offering',
      message: '',
      is_anonymous: false
    }
  })

  const watchedAmount = watch('amount')

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]

  const donationTypes = [
    { value: 'tithe', label: 'Tithe', icon: Church, description: 'Regular tithe offering' },
    { value: 'offering', label: 'General Offering', icon: Heart, description: 'General church support' },
    { value: 'building_fund', label: 'Building Fund', icon: Church, description: 'Church building projects' },
    { value: 'missions', label: 'Missions', icon: Globe, description: 'Global mission work' },
    { value: 'special', label: 'Special Offering', icon: Gift, description: 'Special events and needs' },
    { value: 'campaign', label: 'Campaign', icon: Target, description: 'Specific fundraising campaigns' }
  ]

  const onSubmit = async (data) => {
    setIsProcessing(true)
    try {
      // In a real implementation, this would integrate with Stripe or another payment processor
      console.log('Processing donation:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message
      alert('Thank you for your donation! You will receive a confirmation email shortly.')
      
    } catch (error) {
      console.error('Donation error:', error)
      alert('There was an error processing your donation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount.toString())
    setValue('amount', amount.toString())
  }

  const stats = [
    { label: 'Total Raised This Year', value: '$125,000', icon: TrendingUp },
    { label: 'Active Campaigns', value: campaigns?.data?.length || '3', icon: Target },
    { label: 'Donors This Month', value: '156', icon: Users },
    { label: 'Lives Impacted', value: '2,400+', icon: Heart }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="Support Our Ministry"
        subtitle="Your generosity helps us serve our community and spread God's love"
        backgroundImage="https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      />

      {/* Impact Stats */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how your generous giving is making a difference in our community and beyond
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center group hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-royal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-royal-600 transition-colors">
                  <stat.icon className="w-8 h-8 text-royal-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      {!campaignsLoading && campaigns?.data?.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Campaigns</h2>
              <p className="text-xl text-gray-600">
                Support specific initiatives that are making a difference
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.data.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 group hover:shadow-xl"
                >
                  {campaign.image && (
                    <img
                      src={campaign.image}
                      alt={campaign.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{campaign.name}</h3>
                  
                  <div 
                    className="text-gray-600 mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: campaign.description }}
                  />

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Raised: ${campaign.current_amount}</span>
                      <span>Goal: ${campaign.goal_amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-royal-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(campaign.progress_percentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-semibold text-royal-600">
                        {campaign.progress_percentage.toFixed(1)}% Complete
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCampaign(campaign.id)}
                    className="w-full btn-primary"
                  >
                    Support This Campaign
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Donation Form */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h2>
              <p className="text-xl text-gray-600">
                Your generous giving helps us continue our mission of community influence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Donation Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="card p-8"
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Donation Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Donation Type
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {donationTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                              watch('donation_type') === type.value
                                ? 'border-royal-500 bg-royal-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              value={type.value}
                              {...register('donation_type')}
                              className="sr-only"
                            />
                            <type.icon className="w-5 h-5 text-royal-600 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{type.label}</div>
                              <div className="text-sm text-gray-600">{type.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Amount Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Donation Amount
                      </label>
                      
                      {/* Predefined Amounts */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleAmountSelect(amount)}
                            className={`p-3 border rounded-lg font-semibold transition-colors ${
                              selectedAmount === amount.toString()
                                ? 'border-royal-500 bg-royal-50 text-royal-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>

                      {/* Custom Amount */}
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Enter custom amount"
                          {...register('amount', { 
                            required: 'Amount is required',
                            min: { value: 1, message: 'Minimum donation is $1' }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                        />
                      </div>
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                      )}
                    </div>

                    {/* Donor Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          {...register('donor_name', { required: 'Name is required' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                        {errors.donor_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.donor_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...register('donor_email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                        {errors.donor_email && (
                          <p className="mt-1 text-sm text-red-600">{errors.donor_email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        {...register('donor_phone')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                        placeholder="Your phone number"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        rows={4}
                        {...register('message')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent resize-none"
                        placeholder="Share your heart or prayer request with us..."
                      />
                    </div>

                    {/* Privacy Options */}
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('is_anonymous')}
                          className="rounded border-gray-300 text-royal-600 focus:ring-royal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Make this donation anonymous
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isProcessing || !watchedAmount}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <div className="loading-spinner w-5 h-5 mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Donate {watchedAmount ? `$${watchedAmount}` : ''}
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="card p-6"
                >
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Secure Donations</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Your donation is processed securely through our encrypted payment system. 
                    We never store your payment information.
                  </p>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>SSL Encrypted</span>
                  </div>
                </motion.div>

                {/* Tax Information */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Deductible</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    New Class Royal Ministries is a registered non-profit organization. 
                    Your donation may be tax-deductible.
                  </p>
                  <p className="text-gray-600 text-sm">
                    You will receive a receipt for your records via email.
                  </p>
                </motion.div>

                {/* Ways to Give */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Give</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <strong>Bank Transfer:</strong><br />
                      Contact us for bank details
                    </div>
                    <div>
                      <strong>Mobile Money:</strong><br />
                      +260 975 639 834
                    </div>
                    <div>
                      <strong>In Person:</strong><br />
                      During Sunday service
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Thank You for Your Generosity</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              "Each of you should give what you have decided in your heart to give, 
              not reluctantly or under compulsion, for God loves a cheerful giver."
            </p>
            <p className="text-lg text-gray-300">
              - 2 Corinthians 9:7
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Donations