"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Stop loading when pathname changes (navigation complete)
    setIsLoading(false)
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [pathname])

  // Create a wrapper for navigation that shows loading
  const navigateWithLoading = (url: string) => {
    // Only show loading if navigating to a different page
    if (url !== pathname) {
      setIsLoading(true)
      
      // Set a timeout to hide loading after 5 seconds (fallback)
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false)
      }, 5000)
      
      router.push(url)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isLoading,
    setIsLoading,
    navigateWithLoading
  }
}
