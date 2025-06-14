import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Filter, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Fallback data for development
  const fallbackEvents = [
    {
      id: 1,
      title: "Sunday Worship Service",
      description: "Join us for our weekly worship service with inspiring messages and fellowship.",
      category: { name: "Worship", color: "#3B82F6" },
      start_datetime: "2024-01-21T09:00:00Z",
      end_datetime: "2024-01-21T12:00:00Z",
      location: "Main Sanctuary",
      image: "https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800",
      requires_registration: false,
      is_featured: true,
      registration_count: 0
    },
    {
      id: 2,
      title: "REACTS Ministerial Training",
      description: "Comprehensive training program for aspiring ministers and church leaders.",
      category: { name: "Training", color: "#10B981" },
      start_datetime: "2024-01-25T18:00:00Z",
      end_datetime: "2024-01-25T20:00:00Z",
      location: "REACTS Divine Ministerial College",
      image: "https://images.pexels.com/photos/8923194/pexels-photo-8923194.jpeg?auto=compress&cs=tinysrgb&w=800",
      requires_registration: true,
      is_featured: true,
      registration_count: 25,
      max_attendees: 50
    },
    {
      id: 3,
      title: "Community Resilience Workshop",
      description: "Building resilience in communities through trauma healing and support.",
      category: { name: "Workshop", color: "#F59E0B" },
      start_datetime: "2024-01-28T14:00:00Z",
      end_datetime: "2024-01-28T17:00:00Z",
      location: "Community Center",
      image: "https://images.pexels.com/photos/7551659/pexels-photo-7551659.jpeg?auto=compress&cs=tinysrgb&w=800",
      requires_registration: true,
      is_featured: false,
      registration_count: 15,
      max_attendees: 30
    },
    {
      id: 4,
      title: "Youth Prayer Meeting",
      description: "Special prayer session for young people seeking spiritual growth.",
      category: { name: "Prayer", color: "#8B5CF6" },
      start_datetime: "2024-01-30T19:00:00Z",
      end_datetime: "2024-01-30T21:00:00Z",
      location: "Youth Hall",
      image: "https://images.pexels.com/photos/8468471/pexels-photo-8468471.jpeg?auto=compress&cs=tinysrgb&w=800",
      requires_registration: false,
      is_featured: false,
      registration_count: 0
    }
  ];

  const fallbackCategories = [
    { id: 1, name: "Worship", color: "#3B82F6" },
    { id: 2, name: "Training", color: "#10B981" },
    { id: 3, name: "Workshop", color: "#F59E0B" },
    { id: 4, name: "Prayer", color: "#8B5CF6" },
    { id: 5, name: "Community", color: "#EF4444" }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.results || data);
        } else {
          setEvents(fallbackEvents);
        }
      } catch (error) {
        console.log('Using fallback events data');
        setEvents(fallbackEvents);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/events/categories/');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.log('Using fallback categories data');
        setCategories(fallbackCategories);
      }
    };

    Promise.all([fetchEvents(), fetchCategories()]).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(event =>
        event.category?.name === selectedCategory
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

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

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Church Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Join us for worship, training, and community building events that strengthen our faith and impact our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || "https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {event.is_featured && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    {event.category && (
                      <div
                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold"
                        style={{ backgroundColor: event.category.color }}
                      >
                        {event.category.name}
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {formatDate(event.start_datetime)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      {event.requires_registration && (
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {event.registration_count || 0}
                            {event.max_attendees && ` / ${event.max_attendees}`} registered
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isUpcoming(event.start_datetime) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Upcoming
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Past Event
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Connected
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Don't miss out on upcoming events and opportunities to grow in faith and serve our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/newsletter"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Subscribe to Newsletter
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;