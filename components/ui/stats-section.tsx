"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Building2 as Mosque, DollarSign, Award, TrendingUp } from "lucide-react"
import { getStatistics } from "@/lib/mock-data"

export function StatsSection() {
  const t = useTranslations()
  const [animatedStats, setAnimatedStats] = useState({
    totalMosques: 0,
    totalDonations: 0,
    completedMosques: 0,
    activeProjects: 0,
  })

  const finalStats = getStatistics()

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)

        setAnimatedStats({
          totalMosques: Math.floor(finalStats.totalMosques * easeOut),
          totalDonations: Math.floor(finalStats.totalDonations * easeOut),
          completedMosques: Math.floor(finalStats.completedMosques * easeOut),
          activeProjects: Math.floor(finalStats.activeProjects * easeOut),
        })

        if (step >= steps) {
          clearInterval(timer)
          setAnimatedStats(finalStats)
        }
      }, stepDuration)
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats()
        observer.disconnect()
      }
    })

    const statsElement = document.getElementById("stats-section")
    if (statsElement) {
      observer.observe(statsElement)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats-section" className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mosque className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">
                {animatedStats.totalMosques.toLocaleString()}
              </div>
              <div className="text-slate-600 font-medium">{t("home.stats.mosques")}</div>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                ${animatedStats.totalDonations.toLocaleString()}
              </div>
              <div className="text-slate-600 font-medium">{t("home.stats.donations")}</div>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">{animatedStats.completedMosques}</div>
              <div className="text-slate-600 font-medium">{t("home.stats.completed")}</div>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">{animatedStats.activeProjects}</div>
              <div className="text-slate-600 font-medium">{t("home.stats.projects")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
