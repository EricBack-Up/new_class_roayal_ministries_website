import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Award, 
  Users, 
  Heart, 
  BookOpen, 
  Globe, 
  Target,
  Eye,
  Star
} from 'lucide-react'

// Components
import PageHeader from '../components/common/PageHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Hooks
import { useChurchInfo, useStaff } from '../hooks/useApi'

const About = () => {
  const { data: churchInfo, isLoading: churchLoading } = useChurchInfo()
  const { data: staff, isLoading: staffLoading } = useStaff()

  const [missionRef, missionInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [leadershipRef, leadershipInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [timelineRef, timelineInView] = useInView({ threshold: 0.1, triggerOnce: true })

  if (churchLoading) return <LoadingSpinner size="lg" text="Loading about information..." />

  const church = churchInfo?.data
  const apostle = staff?.data?.find(member => member.position === 'apostle')

  const timeline = [
    {
      year: '2005',
      title: 'Ministry Founded',
      description: 'Apostle Noah Mulanga founded New Class Royal Ministries with a vision for holistic community ministry.'
    },
    {
      year: '2013',
      title: 'REACTS College Established',
      description: 'REACTS Divine Ministerial College was established to provide comprehensive ministerial training.'
    },
    {
      year: '2015',
      title: 'Community Health Ministry',
      description: 'Launched Community Health Ministry programs addressing holistic well-being.'
    },
    {
      year: '2018',
      title: 'International Expansion',
      description: 'Extended ministry reach to USA and Malawi with trauma healing and resilience programs.'
    },
    {
      year: '2020',
      title: 'GROW Ministry Launch',
      description: 'Global Resilience Oral Workshop (GROW) Ministry established for international impact.'
    },
    {
      year: '2024',
      title: 'Continued Growth',
      description: 'Over 400 ministers trained and expanding community influence across multiple nations.'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Holistic Ministry',
      description: 'Addressing spiritual, mental, and physical well-being of individuals and communities.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Building resilient communities through integrated faith and practical support.'
    },
    {
      icon: BookOpen,
      title: 'Education & Training',
      description: 'Providing comprehensive ministerial training and community education programs.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Extending our reach across Zambia, USA, and Malawi for maximum community influence.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="About Us"
        subtitle="Learn about our journey, mission, and the people behind New Class Royal Ministries"
        backgroundImage="https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      />

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-royal-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {church?.mission_statement || 'Called for Community Influence'}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Eye className="w-8 h-8 text-royal-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {church?.vision_statement || 'To build resilient communities through holistic ministry that addresses spiritual, mental, and physical well-being.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-royal-50 rounded-lg">
                  <div className="text-3xl font-bold text-royal-600 mb-2">400+</div>
                  <div className="text-gray-600">Ministers Trained</div>
                </div>
                <div className="text-center p-4 bg-royal-50 rounded-lg">
                  <div className="text-3xl font-bold text-royal-600 mb-2">20+</div>
                  <div className="text-gray-600">Years of Ministry</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/8468/church-cathedral-religion-building.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Our Mission"
                  className="w-full h-96 object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-900/30 to-transparent rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our ministry and shape our approach to community influence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-royal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-royal-600 transition-colors">
                  <value.icon className="w-8 h-8 text-royal-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section ref={leadershipRef} className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={leadershipInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated leaders who guide our ministry with wisdom and compassion
            </p>
          </motion.div>

          {staffLoading ? (
            <LoadingSpinner text="Loading leadership information..." />
          ) : apostle ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={leadershipInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="card p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-1">
                    <div className="relative">
                      <img
                        src={apostle.photo || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"}
                        alt={apostle.name}
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-royal-600 rounded-full flex items-center justify-center">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{apostle.name}</h3>
                    <p className="text-xl text-royal-600 mb-4 capitalize">
                      {apostle.position_display}
                    </p>
                    
                    <div 
                      className="prose prose-lg text-gray-700 mb-6 rich-text"
                      dangerouslySetInnerHTML={{ __html: apostle.bio }}
                    />

                    {apostle.qualifications && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-royal-600" />
                          Qualifications
                        </h4>
                        <p className="text-gray-600">{apostle.qualifications}</p>
                      </div>
                    )}

                    {apostle.specializations && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-royal-600" />
                          Specializations
                        </h4>
                        <p className="text-gray-600">{apostle.specializations}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-600">
              Leadership information will be available soon.
            </div>
          )}

          {/* Other Staff Members */}
          {staff?.data && staff.data.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={leadershipInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staff.data.filter(member => member.position !== 'apostle').map((member) => (
                  <div key={member.id} className="card p-6 text-center">
                    <img
                      src={member.photo || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"}
                      alt={member.name}
                      className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                    />
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                    <p className="text-royal-600 mb-3 capitalize">{member.position_display}</p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {member.bio.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two decades of faithful service and community impact
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-royal-200" />
              
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -50 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex items-start mb-12"
                >
                  {/* Timeline Dot */}
                  <div className="w-16 h-16 bg-royal-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10">
                    {item.year}
                  </div>
                  
                  {/* Content */}
                  <div className="ml-8 card p-6 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
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
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Be part of a ministry that's making a real difference. Whether through service, 
              partnership, or support, there are many ways to get involved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="/contact" className="btn-outline">
                Get Involved
              </a>
              <a href="/ministries" className="btn-outline">
                Explore Ministries
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default About