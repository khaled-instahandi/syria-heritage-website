"use client"

import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useState } from "react"

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  // Debug: Log the current locale
  console.log('LocaleSwitcher render - Current locale:', locale)
  console.log('LocaleSwitcher render - Pathname:', pathname)

  const switchLocale = () => {
    console.log('🔄 Button clicked!')
    console.log('Current locale:', locale)
    console.log('Current pathname:', pathname)
    
    // Use pathname to determine current language instead of locale hook
    if (pathname.startsWith('/en')) {
      console.log('🇸🇦 Switching from English to Arabic')
      window.location.href = "/ar"
    } else if (pathname.startsWith('/ar')) {
      console.log('🇺🇸 Switching from Arabic to English')
      window.location.href = "/en"
    } else {
      console.log('🤔 Unknown path, defaulting to Arabic')
      window.location.href = "/ar"
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={switchLocale} 
      disabled={isLoading}
      className="flex items-center gap-2 bg-white/90 hover:bg-white border-slate-200 transition-all duration-200 shadow-sm"
    >
      <Globe className="w-4 h-4" />
      {isLoading ? (
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200"></div>
        </div>
      ) : (
        <span className="font-medium">
          {pathname.startsWith('/en') ? "عربي" : "English"}
        </span>
      )}
    </Button>
  )
}
