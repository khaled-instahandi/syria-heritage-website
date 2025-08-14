'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

export interface Mosque {
  id: number
  name_ar: string
  name_en: string
  governorate_ar: string
  governorate_en: string
  status: string
}

export function useMosques() {
  const [mosques, setMosques] = useState<Mosque[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMosques = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await apiClient.get('/mosques') as { data: Mosque[] }
        setMosques(data.data || [])
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء تحميل المساجد')
        console.error('Error fetching mosques:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMosques()
  }, [])

  return {
    mosques,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      setError(null)
      // Re-run the effect
    }
  }
}
