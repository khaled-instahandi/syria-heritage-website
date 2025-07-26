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

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    setIsLoading(true)
    
    // Build the new URL with the new locale
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    console.log('Switching locale:', { from: locale, to: newLocale, newPath })
    
    // Force a complete page reload to ensure proper locale switching
    window.location.href = newPath
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={switchLocale} 
      disabled={isLoading}
      className="flex items-center gap-2 bg-white/90 hover:bg-white border-slate-200 transition-all duration-200 shadow-sm min-w-[80px]"
    >
      <Globe className="w-4 h-4" />
      {isLoading ? (
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200"></div>
        </div>
      ) : (
        <span className="font-medium text-sm">
          {locale === 'ar' ? "EN" : "عربي"}
        </span>
      )}
    </Button>
  )
}
