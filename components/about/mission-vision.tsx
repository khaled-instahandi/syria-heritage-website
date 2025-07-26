"use client"

import { useTranslations } from "next-intl"
import { Target, Eye, Sparkles, Star } from "lucide-react"

export function MissionVision() {
  const t = useTranslations("about")

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("missionVision.title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("missionVision.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
            <div className="relative p-8 h-full">
              {/* Background decorative icons */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <Target className="absolute top-4 right-4 w-6 h-6 text-emerald-200 opacity-40" />
                <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-blue-200 opacity-30" />
                <Star className="absolute top-1/2 right-8 w-4 h-4 text-emerald-100 opacity-50" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-6">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("missionVision.mission.title")}</h3>
                <p className="text-gray-600 leading-relaxed">{t("missionVision.mission.description")}</p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
            <div className="relative p-8 h-full">
              {/* Background decorative icons */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <Eye className="absolute top-4 right-4 w-6 h-6 text-blue-200 opacity-40" />
                <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-purple-200 opacity-30" />
                <Star className="absolute top-1/2 right-8 w-4 h-4 text-blue-100 opacity-50" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("missionVision.vision.title")}</h3>
                <p className="text-gray-600 leading-relaxed">{t("missionVision.vision.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
