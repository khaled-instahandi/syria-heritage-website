"use client"

import { useTranslations } from "next-intl"
import { Heart, Users, Shield, Lightbulb, Sparkles, Star, Target, Gift } from "lucide-react"

export function ValuesSection() {
  const t = useTranslations("about")

  const values = [
    {
      icon: Heart,
      key: "heritage",
      color: "emerald",
    },
    {
      icon: Shield,
      key: "community",
      color: "blue",
    },
    {
      icon: Users,
      key: "authenticity",
      color: "purple",
    },
    {
      icon: Target,
      key: "innovation",
      color: "amber",
    },
    {
      icon: Lightbulb,
      key: "responsibility",
      color: "rose",
    },
    {
      icon: Gift,
      key: "giving",
      color: "indigo",
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
        gradient: "from-emerald-50 to-emerald-100",
      },
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        gradient: "from-blue-50 to-blue-100",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        gradient: "from-purple-50 to-purple-100",
      },
      amber: {
        bg: "bg-amber-100",
        text: "text-amber-600",
        border: "border-amber-200",
        gradient: "from-amber-50 to-amber-100",
      },
      rose: {
        bg: "bg-rose-100",
        text: "text-rose-600",
        border: "border-rose-200",
        gradient: "from-rose-50 to-rose-100",
      },
      indigo: {
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        border: "border-indigo-200",
        gradient: "from-indigo-50 to-indigo-100",
      },
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("values.title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("values.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            const colors = getColorClasses(value.color)

            return (
              <div key={value.key} className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-xl transform group-hover:scale-105 transition-transform duration-300`}
                ></div>
                <div className="relative p-6 text-center h-full">
                  {/* Background decorative icons */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <Sparkles className={`absolute top-2 right-2 w-4 h-4 ${colors.text} opacity-20`} />
                    <Star className={`absolute bottom-2 left-2 w-3 h-3 ${colors.text} opacity-30`} />
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-xl mb-4 mx-auto`}
                    >
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`values.items.${value.key}.title`)}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t(`values.items.${value.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
