import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRight, 
  Play, 
  Calendar, 
  Heart, 
  Users, 
  BookOpen,
  MapPin,
  Clock,
  Star,
  Quote
} from 'lucide-react'

// Hooks
import { 
  useChurchInfo, 
  useStaff, 
  useApiQuery,
  useMinistries 
} from '../hooks/useApi'
import { apiService } from '../services/api'

// Components
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const Home = () => {
  const { data: churchInfo, isLoading: churchLoading } = useChurchInfo()
  const { data: staff, isLoading: staffLoading } = useStaff()
  const { data: ministries, isLoading: ministriesLoading } = useMinistries()
  const { data: featuredSermons } = useApiQuery('featuredSermons', apiService.getFeaturedSermons)
  const { data: upcomingEvents } = useApiQuery('upcomingEvents', apiService.getUpcomingEvents)
  const { data: verseOfTheDay } = useApiQuery('verseOfTheDay', apiService.getVerseOfTheDay)
  const { data: stats } = useApiQuery('stats', apiService.getStats)

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [ministriesRef, ministriesInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  if (churchLoading) return <LoadingSpinner size="lg" text="Loading church information..." />

  const church = churchInfo?.data
  const apostle = staff?.data?.find(member => member.position === 'apostle')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-royal-900/90 via-royal-800/70 to-royal-700/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              New Class Royal
              <span className="block text-gold-400">Ministries</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-4 text-gray-200">
              {church?.tagline || 'Called for Community Influence'}
            </p>
            
            <p className="text-lg lg:text-xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A holistic ministry addressing the spiritual, mental, and physical well-being 
              of individuals and communities in Zambia and beyond.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/about" className="btn-primary">
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link to="/live" className="btn-outline">
                <Play className="w-5 h-5 mr-2" />
                Watch Live
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Verse of the Day */}
      {verseOfTheDay?.data && (
        <section className="py-16 bg-gradient-to-r from-gold-50 to-gold-100">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Quote className="w-12 h-12 text-gold-600 mx-auto mb-6" />
              <blockquote className="text-2xl lg:text-3xl font-serif text-gray-800 mb-4 leading-relaxed">
                "{verseOfTheDay.data.verse_text}"
              </blockquote>
              <cite className="text-lg font-semibold text-gold-700">
                {verseOfTheDay.data.reference}
              </cite>
            </motion.div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section ref={aboutRef} className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About Our Ministry
              </h2>
              
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>
                  Founded in 2005 by Apostle Noah Mulanga, New Class Royal Ministries has 
                  evolved over two decades into a holistic approach addressing the spiritual, 
                  mental, and physical well-being of individuals and communities.
                </p>
                
                <p>
                  Our mission extends across Zambia, the USA, and Malawi, focusing on 
                  ministerial training, community health, trauma healing, and resilience building.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-royal-600 mb-2">400+</div>
                  <div className="text-gray-600">Ministers Trained</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-royal-600 mb-2">20+</div>
                  <div className="text-gray-600">Years of Ministry</div>
                </div>
              </div>

              <Link to="/about" className="btn-primary">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="New Class Royal Ministries"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-900/50 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <h4 className="font-bold text-gray-900 mb-2">Our Mission</h4>
                <p className="text-gray-600 text-sm">
                  {church?.mission_statement || 'Called for Community Influence'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section ref={ministriesRef} className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ministriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Ministries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive programs addressing spiritual, mental, and physical well-being
            </p>
          </motion.div>

          {ministriesLoading ? (
            <LoadingSpinner text="Loading ministries..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ministries?.data?.slice(0, 6).map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={ministriesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 group hover:shadow-2xl"
                >
                  <div className="w-12 h-12 bg-royal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-royal-600 transition-colors">
                    <BookOpen className="w-6 h-6 text-royal-600 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {ministry.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {ministry.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                  
                  <Link 
                    to={`/ministries#${ministry.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-royal-600 hover:text-royal-700 font-semibold flex items-center"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={ministriesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link to="/ministries" className="btn-primary">
              View All Ministries
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-padding gradient-bg text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-200">
              Making a difference in communities across Zambia and beyond
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                number: stats?.data?.total_staff || '10+', 
                label: 'Staff Members',
                icon: Users 
              },
              { 
                number: stats?.data?.total_ministries || '5+', 
                label: 'Active Ministries',
                icon: Heart 
              },
              { 
                number: '400+', 
                label: 'Ministers Trained',
                icon: BookOpen 
              },
              { 
                number: '20+', 
                label: 'Years of Service',
                icon: Star 
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-gold-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Sermons */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Recent Sermons</h3>
              
              {featuredSermons?.data?.slice(0, 3).map((sermon) => (
                <div key={sermon.id} className="flex space-x-4 mb-6 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 bg-royal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-royal-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{sermon.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      by {sermon.preacher_name} • {new Date(sermon.date_preached).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{sermon.scripture_reference}</p>
                  </div>
                </div>
              ))}
              
              <Link to="/sermons" className="btn-secondary">
                View All Sermons
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h3>
              
              {upcomingEvents?.data?.slice(0, 3).map((event) => (
                <div key={event.id} className="flex space-x-4 mb-6 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-gold-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(event.start_datetime).toLocaleDateString()}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {event.description?.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </div>
              ))}
              
              <Link to="/events" className="btn-secondary">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-royal-600 to-royal-800 text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Be part of a ministry that's making a real difference in communities. 
              Whether you're seeking spiritual growth, want to serve others, or need support, 
              you have a place here.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/contact" className="btn-outline">
                Get in Touch
              </Link>
              <Link to="/prayer" className="btn-outline">
                <Heart className="w-5 h-5 mr-2" />
                Prayer Request
              </Link>
              <Link to="/donations" className="bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Support Our Ministry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home