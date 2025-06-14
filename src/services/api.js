import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh/', {
            refresh: refreshToken,
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// API service functions
export const apiService = {
  // Church Info
  getChurchInfo: () => api.get('/core/church-info/'),
  getStaff: () => api.get('/core/staff/'),
  getMinistries: () => api.get('/core/ministries/'),
  getAnnouncements: () => api.get('/core/announcements/'),
  getVerseOfTheDay: () => api.get('/core/verse-of-the-day/'),
  getPrograms: () => api.get('/core/programs/'),
  getStats: () => api.get('/core/stats/'),

  // Sermons
  getSermons: (params) => api.get('/sermons/', { params }),
  getSermon: (id) => api.get(`/sermons/${id}/`),
  getSermonSeries: () => api.get('/sermons/series/'),
  getFeaturedSermons: () => api.get('/sermons/featured/'),
  getRecentSermons: () => api.get('/sermons/recent/'),
  getPopularSermons: () => api.get('/sermons/popular/'),
  searchSermons: (params) => api.get('/sermons/search/', { params }),

  // Events
  getEvents: (params) => api.get('/events/', { params }),
  getEvent: (id) => api.get(`/events/${id}/`),
  getUpcomingEvents: () => api.get('/events/upcoming/'),
  getFeaturedEvents: () => api.get('/events/featured/'),
  getEventCategories: () => api.get('/events/categories/'),
  registerForEvent: (eventId, data) => api.post(`/events/${eventId}/register/`, data),

  // Prayer
  getPrayerRequests: (params) => api.get('/prayer/', { params }),
  getPrayerRequest: (id) => api.get(`/prayer/${id}/`),
  createPrayerRequest: (data) => api.post('/prayer/create/', data),
  prayForRequest: (id, data) => api.post(`/prayer/${id}/pray/`, data),
  getMyPrayerRequests: () => api.get('/prayer/my-requests/'),
  getPrayerCategories: () => api.get('/prayer/categories/'),

  // Donations
  getDonationCampaigns: () => api.get('/donations/campaigns/'),
  createDonation: (data) => api.post('/donations/', data),
  getDonationHistory: () => api.get('/donations/history/'),

  // Newsletter
  subscribeNewsletter: (data) => api.post('/newsletter/subscribe/', data),
  unsubscribeNewsletter: (data) => api.post('/newsletter/unsubscribe/', data),

  // Live Stream
  getLiveStreams: () => api.get('/livestream/'),
  getCurrentLiveStream: () => api.get('/livestream/current/'),
  getUpcomingStreams: () => api.get('/livestream/upcoming/'),
  joinStream: (streamId) => api.post(`/livestream/${streamId}/join/`),
  leaveStream: (streamId) => api.post(`/livestream/${streamId}/leave/`),

  // Contact
  sendContactMessage: (data) => api.post('/core/contact/', data),

  // Authentication
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
}

export default api