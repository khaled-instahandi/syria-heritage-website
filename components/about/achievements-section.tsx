"use client"

import { useTranslations } from "next-intl"
import { Trophy, Award, Users, Building, Sparkles, Star } from "lucide-react"

export function AchievementsSection() {
  const t = useTranslations("about")

  const achievements = [
    { key: "mosques", icon: Building, value: "150+", color: "emerald" },
    { key: "volunteers", icon: Users, value: "500+", color: "blue" },
    { key: "awards", icon: Award, value: "12", color: "purple" },
    { key: "years", icon: Trophy, value: "4", color: "amber" },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        gradient: "from-emerald-50 to-emerald-100",
      },
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        gradient: "from-blue-50 to-blue-100",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        gradient: "from-purple-50 to-purple-100",
      },
      amber: {
        bg: "bg-amber-100",
        text: "text-amber-600",
        gradient: "from-amber-50 to-amber-100",
      },
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">{t("achievements.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("achievements.title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("achievements.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            const colors = getColorClasses(achievement.color)

            return (
              <div key={achievement.key} className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-xl transform group-hover:scale-105 transition-transform duration-300`}
                ></div>
                <div className="relative p-8 text-center h-full">
                  {/* Background decorative icons */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <Sparkles className={`absolute top-3 right-3 w-5 h-5 ${colors.text} opacity-20`} />
                    <Star className={`absolute bottom-3 left-3 w-4 h-4 ${colors.text} opacity-30`} />
                  </div>

                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-xl mb-4`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <div className={`text-4xl font-bold ${colors.text} mb-2`}>{achievement.value}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t(`achievements.items.${achievement.key}.title`)}
                    </h3>
                    <p className="text-gray-600 text-sm">{t(`achievements.items.${achievement.key}.description`)}</p>
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
