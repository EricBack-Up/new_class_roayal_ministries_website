import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Download, 
  Calendar, 
  User, 
  BookOpen, 
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';

const SermonDetail = () => {
  const { id } = useParams();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/sermons/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setSermon(data);
        } else {
          throw new Error('Sermon not found');
        }
      } catch (err) {
        console.error('Error fetching sermon:', err);
        // Fallback data for development
        setSermon({
          id: parseInt(id),
          title: "Walking in Faith",
          description: "A powerful message about trusting God in uncertain times and finding strength through faith.",
          preacher_name: "Apostle Noah C. Mulanga",
          preacher_photo: null,
          series_title: "Faith Series",
          scripture_reference: "Hebrews 11:1-6",
          audio_file: null,
          video_file: null,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          sermon_notes: null,
          thumbnail: null,
          date_preached: "2024-01-15T10:00:00Z",
          duration_minutes: 45,
          view_count: 234,
          download_count: 67,
          tags: ["faith", "trust", "spiritual growth"],
          comments_count: 12
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
  }, [id]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // Increment view count
    if (sermon && !isPlaying) {
      setSermon(prev => ({ ...prev, view_count: prev.view_count + 1 }));
    }
  };

  const handleDownload = (type) => {
    // Track download
    if (sermon) {
      setSermon(prev => ({ ...prev, download_count: prev.download_count + 1 }));
      
      // Send tracking request to backend
      fetch(`http://localhost:8000/api/sermons/${id}/download/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_type: type })
      }).catch(err => console.error('Error tracking download:', err));
    }
  };

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sermon...</p>
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sermon Not Found</h2>
          <p className="text-gray-600 mb-6">The sermon you're looking for doesn't exist.</p>
          <Link 
            to="/sermons" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Sermons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/sermons" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Sermons
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Video/Audio Player */}
              <div className="relative bg-gray-900 aspect-video">
                {sermon.video_url || sermon.video_file ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlay}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-6 transition-colors"
                    >
                      <Play className="h-12 w-12" />
                    </button>
                  </div>
                ) : sermon.audio_file ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="bg-blue-600 rounded-full p-6 mx-auto mb-4">
                        <Play className="h-12 w-12" />
                      </div>
                      <p className="text-lg">Audio Sermon</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg opacity-75">Sermon Notes Available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sermon Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {sermon.title}
                    </h1>
                    {sermon.series_title && (
                      <p className="text-blue-600 font-medium mb-2">
                        Part of: {sermon.series_title}
                      </p>
                    )}
                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(sermon.date_preached)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(sermon.duration_minutes)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {sermon.view_count} views
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Scripture Reference */}
                {sermon.scripture_reference && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">
                        Scripture: {sermon.scripture_reference}
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {sermon.description}
                  </p>
                </div>

                {/* Tags */}
                {sermon.tags && sermon.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {sermon.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Options */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Download Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {sermon.audio_file && (
                      <button
                        onClick={() => handleDownload('audio')}
                        className="flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Audio
                      </button>
                    )}
                    {(sermon.video_file || sermon.video_url) && (
                      <button
                        onClick={() => handleDownload('video')}
                        className="flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Video
                      </button>
                    )}
                    {sermon.sermon_notes && (
                      <button
                        onClick={() => handleDownload('notes')}
                        className="flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Notes
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Downloaded {sermon.download_count} times
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preacher Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preacher</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{sermon.preacher_name}</p>
                  <p className="text-sm text-gray-600">Minister</p>
                </div>
              </div>
            </motion.div>

            {/* Related Sermons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Sermons</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Play className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        Related Sermon Title {item}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {sermon.preacher_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comments Count */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                {sermon.comments_count} comments from our community
              </p>
              <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Comments →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonDetail;