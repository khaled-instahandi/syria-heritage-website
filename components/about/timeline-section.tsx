"use client"

import { useTranslations } from "next-intl"
import { Calendar, CheckCircle, Clock, Sparkles } from "lucide-react"

export function TimelineSection() {
  const t = useTranslations("about")

  const timelineItems = [
    { key: "launch", year: "2020", status: "completed" },
    { key: "expansion", year: "2021", status: "completed" },
    { key: "digitization", year: "2022", status: "completed" },
    { key: "partnerships", year: "2023", status: "current" },
    { key: "future", year: "2024", status: "planned" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "current":
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <Calendar className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-200 bg-emerald-50"
      case "current":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{t("timeline.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("timeline.title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("timeline.subtitle")}</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-blue-200 to-gray-200"></div>

          <div className="space-y-8">
            {timelineItems.map((item, index) => (
              <div key={item.key} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getStatusColor(item.status)}`}
                >
                  {getStatusIcon(item.status)}
                  {/* Background decorative icon */}
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-emerald-300 opacity-60" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300"></div>
                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-emerald-600">{item.year}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`timeline.items.${item.key}.title`)}</h3>
                      <p className="text-gray-600 leading-relaxed">{t(`timeline.items.${item.key}.description`)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
