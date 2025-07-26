"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar"
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <Button variant="outline" size="sm" onClick={switchLocale} className="flex items-center gap-2 bg-transparent">
      <Globe className="w-4 h-4" />
      {locale === "ar" ? "EN" : "عربي"}
    </Button>
  )
}
