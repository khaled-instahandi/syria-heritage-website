"use client"

import { useTranslations } from "next-intl"
import { Target, CheckCircle, Sparkles, Star } from "lucide-react"

export function ObjectivesSection() {
  const t = useTranslations("about")

  const objectives = ["documentation", "restoration", "education", "community", "technology", "partnerships"]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">{t("objectives.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("objectives.title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("objectives.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.map((objective, index) => (
            <div key={objective} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative p-6 h-full">
                {/* Background decorative icons */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <Sparkles className="absolute top-3 right-3 w-4 h-4 text-emerald-200 opacity-40" />
                  <Star className="absolute bottom-3 left-3 w-3 h-3 text-emerald-100 opacity-50" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-emerald-600">
                      {t("objectives.badge")} {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`objectives.items.${objective}.title`)}</h3>
                  <p className="text-gray-600 leading-relaxed">{t(`objectives.items.${objective}.description`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
