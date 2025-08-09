"use client"

import { useTranslations } from "next-intl"
import { Building2 } from "lucide-react"

export function NavigationLoading() {
  const t = useTranslations("common")

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        {/* Loading Icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">{t("loading")}</h3>
          <p className="text-sm text-slate-600">{t("loadingDesc")}</p>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}
