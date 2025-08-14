"use client"

import { useTranslations } from "next-intl"
import { Sparkles, Star, Heart } from "lucide-react"

export function HeroSection() {
  const t = useTranslations("about")

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Background decorative icons */}
      <div className="absolute inset-0 overflow-hidden">
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-emerald-300 opacity-60 animate-pulse" />
        <Star className="absolute top-32 right-32 w-4 h-4 text-blue-300 opacity-40 animate-bounce" />
        <Heart className="absolute bottom-40 left-40 w-5 h-5 text-purple-300 opacity-50 animate-pulse" />
        <Sparkles className="absolute bottom-20 right-20 w-7 h-7 text-emerald-200 opacity-30 animate-bounce" />
        <Star className="absolute top-1/2 left-10 w-3 h-3 text-blue-200 opacity-60 animate-pulse" />
        <Heart className="absolute top-1/3 right-10 w-4 h-4 text-purple-200 opacity-40 animate-bounce" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200 mb-6">
          <Heart className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">{t("badge")}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">{t("hero.title")}</h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">{t("hero.subtitle")}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <Heart className="w-5 h-5" />
            {t("hero.cta.primary")}
          </button>
          {/* <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <Star className="w-5 h-5" />
            {t("hero.cta.secondary")}
          </button> */}
        </div>
      </div>
    </section>
  )
}
