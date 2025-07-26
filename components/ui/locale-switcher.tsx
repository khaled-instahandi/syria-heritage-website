"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useTransition } from "react"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    
    startTransition(() => {
      // Get the path without locale
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
      
      // Create new path with new locale
      const newPath = `/${newLocale}${pathWithoutLocale}`
      
      console.log('Switching from', locale, 'to', newLocale)
      console.log('Current pathname:', pathname)
      console.log('New pathname:', newPath)
      
      // Navigate to new path
      router.push(newPath)
      router.refresh()
    })
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={switchLocale} 
      disabled={isPending}
      className="flex items-center gap-2 bg-white/90 hover:bg-white border-slate-200 transition-all duration-200 shadow-sm"
    >
      <Globe className="w-4 h-4" />
      {isPending ? (
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200"></div>
        </div>
      ) : (
        <span className="font-medium">
          {locale === 'ar' ? "English" : "عربي"}
        </span>
      )}
    </Button>
  )
}
