import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Users, 
  MessageSquare, 
  Share2, 
  Calendar, 
  Clock, 
  Video,
  Wifi,
  WifiOff,
  Send,
  Heart,
  Volume2,
  VolumeX,
  Maximize,
  Settings
} from 'lucide-react'

// Components
import PageHeader from '../components/common/PageHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Hooks
import { useApiQuery } from '../hooks/useApi'
import { apiService } from '../services/api'

const LiveStream = () => {
  const [isLive, setIsLive] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { data: currentStream, isLoading: streamLoading } = useApiQuery(
    'currentStream', 
    apiService.getCurrentLiveStream
  )
  const { data: upcomingStreams } = useApiQuery(
    'upcomingStreams', 
    apiService.getUpcomingStreams
  )

  useEffect(() => {
    // Simulate live stream status
    if (currentStream?.data?.length > 0) {
      setIsLive(true)
      setViewerCount(Math.floor(Math.random() * 500) + 50)
    }

    // Simulate chat messages
    const sampleMessages = [
      { id: 1, name: 'John M.', message: 'Praise the Lord! 🙏', time: '2 min ago' },
      { id: 2, name: 'Sarah K.', message: 'Powerful message today!', time: '3 min ago' },
      { id: 3, name: 'David L.', message: 'Amen! God bless', time: '5 min ago' },
      { id: 4, name: 'Grace W.', message: 'Praying for everyone watching', time: '7 min ago' },
    ]
    setChatMessages(sampleMessages)
  }, [currentStream])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        name: 'You',
        message: chatMessage,
        time: 'now'
      }
      setChatMessages(prev => [newMessage, ...prev])
      setChatMessage('')
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  if (streamLoading) {
    return <LoadingSpinner size="lg" text="Loading live stream..." />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <PageHeader
        title="Live Stream"
        subtitle="Join us for live worship, teaching, and fellowship"
        backgroundImage="https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      />

      <div className="container-max section-padding">
        {isLive ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Video Player */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black rounded-xl overflow-hidden shadow-2xl"
              >
                {/* Video Container */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
                  {/* Live Indicator */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-semibold">LIVE</span>
                    </div>
                  </div>

                  {/* Viewer Count */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{viewerCount}</span>
                    </div>
                  </div>

                  {/* Video Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-24 h-24 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-semibold mb-2">Live Stream Active</p>
                      <p className="text-gray-300">Sunday Worship Service</p>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="text-white hover:text-gray-300 transition-colors">
                          <Play className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button className="text-white hover:text-gray-300 transition-colors">
                          <Settings className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          <Maximize className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="bg-white p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Sunday Worship Service
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Join us for inspiring worship, powerful teaching, and community fellowship.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date().toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Started at 9:00 AM
                      </div>
                    </div>
                    
                    <button className="flex items-center space-x-2 text-royal-600 hover:text-royal-700 font-semibold">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Live Chat */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg h-full flex flex-col"
              >
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-royal-600" />
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {msg.name}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-royal-600 hover:bg-royal-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* No Live Stream */
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <WifiOff className="w-12 h-12 text-gray-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Live Stream Currently
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We're not streaming live right now, but check back during our service times 
                or view our upcoming streams below.
              </p>

              {/* Service Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sunday Service</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>9:00 AM - 12:00 PM</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Join us for worship, teaching, and fellowship
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Wednesday Service</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>6:00 PM - 8:00 PM</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Midweek prayer and Bible study
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Upcoming Streams */}
        {upcomingStreams?.data && upcomingStreams.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Upcoming Streams
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingStreams.data.map((stream) => {
                const { date, time } = formatDateTime(stream.scheduled_start)
                
                return (
                  <div key={stream.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-br from-royal-600 to-royal-800">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="w-12 h-12 mx-auto mb-2" />
                          <p className="font-semibold">{stream.stream_type_display}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {stream.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {stream.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{time}</span>
                        </div>
                      </div>
                      
                      <button className="mt-4 w-full bg-royal-600 hover:bg-royal-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Set Reminder
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-royal-600 to-royal-800 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
            Never miss a service! Subscribe to our newsletter and follow us on social media 
            for live stream notifications and updates.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/newsletter" className="bg-white text-royal-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors">
              Subscribe to Newsletter
            </a>
            <a href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-royal-600 font-semibold py-3 px-6 rounded-lg transition-colors">
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LiveStream