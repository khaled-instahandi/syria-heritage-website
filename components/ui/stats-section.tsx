"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Building2 as Mosque, DollarSign, Award, TrendingUp } from "lucide-react"
import { api } from "@/lib/api"
import { Statistics } from "@/lib/types"

export function StatsSection() {
  const t = useTranslations()
  const [animatedStats, setAnimatedStats] = useState({
    damagedMosques: 0,
    totalDonations: 0,
    completedProjects: 0,
    totalProjects: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [finalStats, setFinalStats] = useState<Statistics>({
    damaged_mosques: 0,
    total_projects: 0,
    completed_projects: 0,
    total_donations: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const stats = await api.getStatistics()
        setFinalStats(stats)
      } catch (error) {
        console.error('Error fetching statistics:', error)
        // في حالة الخطأ، استخدم قيم افتراضية
        setFinalStats({
          damaged_mosques: 0,
          total_projects: 0,
          completed_projects: 0,
          total_donations: 0
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const animateStats = () => {
        const duration = 1500
        // get min final value from array
        const minFinalValue = Math.max(
          finalStats.damaged_mosques,
          finalStats.total_donations,
          finalStats.completed_projects,
          finalStats.total_projects
        )
        const steps = minFinalValue
        const stepDuration = duration / steps

        let step = 0
        const timer = setInterval(() => {
          step++
          const progress = step / steps
          const easeOut = 1 - Math.pow(1 - progress, 3)

          setAnimatedStats({
            damagedMosques: Math.floor(finalStats.damaged_mosques * easeOut),
            totalDonations: Math.floor(finalStats.total_donations * easeOut),
            completedProjects: Math.floor(finalStats.completed_projects * easeOut),
            totalProjects: Math.floor(finalStats.total_projects * easeOut),
          })

          if (step >= steps) {
            clearInterval(timer)
            setAnimatedStats({
              damagedMosques: finalStats.damaged_mosques,
              totalDonations: finalStats.total_donations,
              completedProjects: finalStats.completed_projects,
              totalProjects: finalStats.total_projects,
            })
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
    }
  }, [isLoading, finalStats])

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
                {isLoading ? (
                  <div className="h-8 bg-emerald-200 rounded animate-pulse"></div>
                ) : (
                  animatedStats.damagedMosques.toLocaleString()
                )}
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
                {isLoading ? (
                  <div className="h-8 bg-blue-200 rounded animate-pulse"></div>
                ) : (
                  `$${animatedStats.totalDonations.toLocaleString()}`
                )}
              </div>
              <div className="text-slate-600 font-medium">{t("home.stats.donations")}</div>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">
                {isLoading ? (
                  <div className="h-8 bg-amber-200 rounded animate-pulse"></div>
                ) : (
                  animatedStats.completedProjects
                )}
              </div>
              <div className="text-slate-600 font-medium">{t("home.stats.completed")}</div>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                {isLoading ? (
                  <div className="h-8 bg-purple-200 rounded animate-pulse"></div>
                ) : (
                  animatedStats.totalProjects
                )}
              </div>
              <div className="text-slate-600 font-medium">{t("home.stats.projects")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
