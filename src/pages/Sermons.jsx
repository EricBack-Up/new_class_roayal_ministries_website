import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Calendar, User, Clock, Search, Filter } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');

  useEffect(() => {
    fetchSermons();
    fetchSeries();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await fetch('/api/sermons/');
      const data = await response.json();
      setSermons(data.results || data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      // Fallback data
      setSermons([
        {
          id: 1,
          title: "Walking in Faith",
          description: "A powerful message about trusting God in uncertain times.",
          preacher_name: "Apostle Noah C. Mulanga",
          scripture_reference: "Hebrews 11:1",
          date_preached: "2024-01-07",
          duration_minutes: 45,
          view_count: 150,
          series_title: "Faith Series",
          thumbnail: "https://images.pexels.com/photos/8468/bible-open-book-religion-christian.jpg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: 2,
          title: "Community Influence",
          description: "Understanding our calling to impact our communities for Christ.",
          preacher_name: "Apostle Noah C. Mulanga",
          scripture_reference: "Matthew 5:13-16",
          date_preached: "2024-01-14",
          duration_minutes: 52,
          view_count: 203,
          series_title: "Called for Influence",
          thumbnail: "https://images.pexels.com/photos/1904769/pexels-photo-1904769.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: 3,
          title: "Healing and Restoration",
          description: "God's heart for healing broken lives and communities.",
          preacher_name: "Apostle Noah C. Mulanga",
          scripture_reference: "Isaiah 61:1-3",
          date_preached: "2024-01-21",
          duration_minutes: 48,
          view_count: 178,
          series_title: "Restoration Series",
          thumbnail: "https://images.pexels.com/photos/1904769/pexels-photo-1904769.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await fetch('/api/sermons/series/');
      const data = await response.json();
      setSeries(data.results || data);
    } catch (error) {
      console.error('Error fetching series:', error);
      // Fallback data
      setSeries([
        { id: 1, title: "Faith Series" },
        { id: 2, title: "Called for Influence" },
        { id: 3, title: "Restoration Series" }
      ]);
    }
  };

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.scripture_reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = !selectedSeries || sermon.series_title === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Sermons"
        subtitle="Listen to inspiring messages that transform lives and communities"
        backgroundImage="https://images.pexels.com/photos/8468/bible-open-book-religion-christian.jpg?auto=compress&cs=tinysrgb&w=1200"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Series</option>
                {series.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all duration-200">
                    <Play className="h-6 w-6 text-blue-600" />
                  </button>
                </div>
                {sermon.series_title && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {sermon.series_title}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {sermon.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {sermon.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    {sermon.preacher_name}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(sermon.date_preached)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDuration(sermon.duration_minutes)}
                  </div>
                </div>

                {sermon.scripture_reference && (
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {sermon.scripture_reference}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {sermon.view_count} views
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                      <Play className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSermons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sermons found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sermons;