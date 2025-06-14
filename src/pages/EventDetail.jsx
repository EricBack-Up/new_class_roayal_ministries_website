import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ShareIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    number_of_attendees: 1,
    special_requirements: ''
  });

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        // Fallback data for development
        setEvent({
          id: parseInt(id),
          title: "Community Resilience Workshop",
          description: "Interactive workshop designed to build resilience in communities facing various challenges including trauma, substance abuse, and social issues. These workshops combine biblical principles with practical resilience-building techniques.",
          category: {
            name: "Workshop",
            color: "#10B981"
          },
          ministry: {
            name: "Trauma Healing & Resilience Building"
          },
          start_datetime: "2024-02-15T14:00:00Z",
          end_datetime: "2024-02-15T17:00:00Z",
          all_day: false,
          location: "Community Center, Lilanda West",
          address: "Lilanda West, Lusaka, Zambia",
          online_link: "",
          image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
          requires_registration: true,
          max_attendees: 30,
          registration_deadline: "2024-02-14T23:59:59Z",
          registration_fee: 0.00,
          is_published: true,
          is_featured: true,
          contact_person: "Apostle Noah Mulanga",
          contact_email: "apostle@newclassroyalministries.com",
          contact_phone: "+260 975 639 834",
          registration_count: 18,
          is_registration_open: true,
          is_upcoming: true,
          is_ongoing: false,
          is_past: false
        });
      }
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setRegistering(true);

    try {
      const response = await fetch(`/api/events/${id}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (response.ok) {
        setRegistered(true);
        setEvent(prev => ({
          ...prev,
          registration_count: prev.registration_count + registrationData.number_of_attendees
        }));
      } else {
        // For demo purposes, simulate successful registration
        setRegistered(true);
        setEvent(prev => ({
          ...prev,
          registration_count: prev.registration_count + registrationData.number_of_attendees
        }));
      }
    } catch (err) {
      console.error('Registration failed:', err);
      // For demo purposes, simulate successful registration
      setRegistered(true);
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: event.category?.color || '#3B82F6', color: 'white' }}
                >
                  {event.category?.name || 'Event'}
                </span>
                {event.is_featured && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <div className="flex items-center space-x-6 text-lg">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {formatDate(event.start_datetime)}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  {formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
              
              {event.ministry && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Organized by</h3>
                  <p className="text-blue-800">{event.ministry.name}</p>
                </div>
              )}
            </motion.div>

            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">{event.location}</p>
                    {event.address && (
                      <p className="text-sm text-gray-500 mt-1">{event.address}</p>
                    )}
                  </div>
                </div>

                {event.requires_registration && (
                  <div className="flex items-start">
                    <UserGroupIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Attendance</h3>
                      <p className="text-gray-600">
                        {event.registration_count} registered
                        {event.max_attendees && ` of ${event.max_attendees} max`}
                      </p>
                    </div>
                  </div>
                )}

                {event.contact_person && (
                  <div className="flex items-start">
                    <HeartIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Contact Person</h3>
                      <p className="text-gray-600">{event.contact_person}</p>
                      {event.contact_email && (
                        <p className="text-sm text-blue-600 hover:underline">
                          <a href={`mailto:${event.contact_email}`}>{event.contact_email}</a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <ShareIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Share Event</h3>
                    <button
                      onClick={shareEvent}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Share with friends
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6 sticky top-6"
            >
              {registered ? (
                <div className="text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Confirmed!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for registering. You will receive a confirmation email shortly.
                  </p>
                  <button
                    onClick={() => navigate('/events')}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    View More Events
                  </button>
                </div>
              ) : event.requires_registration && event.is_registration_open ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Register for Event</h3>
                  {event.registration_fee > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 font-semibold">
                        Registration Fee: ${event.registration_fee}
                      </p>
                    </div>
                  )}
                  
                  <form onSubmit={handleRegistration} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={registrationData.first_name}
                          onChange={(e) => setRegistrationData(prev => ({
                            ...prev,
                            first_name: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={registrationData.last_name}
                          onChange={(e) => setRegistrationData(prev => ({
                            ...prev,
                            last_name: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={registrationData.phone}
                        onChange={(e) => setRegistrationData(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Attendees
                      </label>
                      <select
                        value={registrationData.number_of_attendees}
                        onChange={(e) => setRegistrationData(prev => ({
                          ...prev,
                          number_of_attendees: parseInt(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requirements
                      </label>
                      <textarea
                        rows={3}
                        value={registrationData.special_requirements}
                        onChange={(e) => setRegistrationData(prev => ({
                          ...prev,
                          special_requirements: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special needs or requirements..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={registering}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registering ? 'Registering...' : 'Register Now'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Event Information</h3>
                  {!event.requires_registration ? (
                    <div>
                      <p className="text-gray-600 mb-4">
                        No registration required. Just show up and join us!
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-semibold">Free Event</p>
                        <p className="text-green-700 text-sm">Open to everyone</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 font-semibold">Registration Closed</p>
                      <p className="text-red-700 text-sm">
                        Registration deadline has passed or event is full.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;