import { useQuery, useMutation, useQueryClient } from 'react-query'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

// Custom hook for API queries
export const useApiQuery = (key, queryFn, options = {}) => {
  return useQuery(key, queryFn, {
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      toast.error(message)
    },
    ...options,
  })
}

// Custom hook for API mutations
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation(mutationFn, {
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      toast.error(message)
    },
    onSuccess: (data, variables, context) => {
      if (options.successMessage) {
        toast.success(options.successMessage)
      }
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(key => {
          queryClient.invalidateQueries(key)
        })
      }
    },
    ...options,
  })
}

// Specific API hooks
export const useChurchInfo = () => {
  return useApiQuery('churchInfo', apiService.getChurchInfo)
}

export const useStaff = () => {
  return useApiQuery('staff', apiService.getStaff)
}

export const useMinistries = () => {
  return useApiQuery('ministries', apiService.getMinistries)
}

export const useSermons = (params = {}) => {
  return useApiQuery(['sermons', params], () => apiService.getSermons(params))
}

export const useSermon = (id) => {
  return useApiQuery(['sermon', id], () => apiService.getSermon(id), {
    enabled: !!id,
  })
}

export const useEvents = (params = {}) => {
  return useApiQuery(['events', params], () => apiService.getEvents(params))
}

export const useEvent = (id) => {
  return useApiQuery(['event', id], () => apiService.getEvent(id), {
    enabled: !!id,
  })
}

export const usePrayerRequests = (params = {}) => {
  return useApiQuery(['prayerRequests', params], () => apiService.getPrayerRequests(params))
}

export const useCreatePrayerRequest = () => {
  return useApiMutation(apiService.createPrayerRequest, {
    successMessage: 'Prayer request submitted successfully!',
    invalidateQueries: ['prayerRequests'],
  })
}

export const usePrayForRequest = () => {
  return useApiMutation(
    ({ id, data }) => apiService.prayForRequest(id, data),
    {
      successMessage: 'Thank you for praying!',
      invalidateQueries: ['prayerRequests'],
    }
  )
}

export const useNewsletterSubscribe = () => {
  return useApiMutation(apiService.subscribeNewsletter, {
    successMessage: 'Successfully subscribed to newsletter!',
  })
}

export const useContactMessage = () => {
  return useApiMutation(apiService.sendContactMessage, {
    successMessage: 'Message sent successfully! We will get back to you soon.',
  })
}

export const useEventRegistration = () => {
  return useApiMutation(
    ({ eventId, data }) => apiService.registerForEvent(eventId, data),
    {
      successMessage: 'Successfully registered for event!',
    }
  )
}