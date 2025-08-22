"use client"

import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatsSection } from "@/components/ui/stats-section"
import { ProjectCard } from "@/components/ui/project-card"
import { Star, Heart, Target, ChevronDown, Sparkles } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"
import { transformMosquesToProjects, DisplayProject } from "@/lib/data-transformers"
import { api } from "@/lib/api"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const t = useTranslations()
  const locale = useLocale()
  const [featuredProjects, setFeaturedProjects] = useState<DisplayProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // جلب المساجد المميزة من API
  useEffect(() => {
    const fetchFeaturedMosques = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await api.getFeaturedMosques()
        if (response.data && response.data.length > 0) {
          // تحويل المساجد إلى مشاريع وأخذ أول 3
          const projects = transformMosquesToProjects(response.data, locale).slice(0, 3)
          setFeaturedProjects(projects)
        } else {
          // في حالة عدم وجود بيانات، استخدم البيانات الوهمية
          setFeaturedProjects(mockProjects.slice(0, 3) as any)
        }
      } catch (err) {
        console.error('Error fetching featured mosques:', err)
        setError('فشل في جلب البيانات')
        // استخدم البيانات الوهمية في حالة الخطأ
        setFeaturedProjects(mockProjects.slice(0, 3) as any)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedMosques()
  }, [locale])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden hero-section">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/bg-hero.jpg")' }}></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-900/30"></div>

        {/* Decorative Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <Sparkles className="absolute top-20 left-20 w-6 h-6 text-white/60 opacity-60" />
          <Sparkles className="absolute top-40 right-32 w-4 h-4 text-white/40 opacity-40" />
          <Sparkles className="absolute bottom-32 left-40 w-5 h-5 text-white/50 opacity-50" />
          <Sparkles className="absolute bottom-20 right-20 w-6 h-6 text-white/30 opacity-30" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-in fade-in-50 slide-in-from-bottom-4">
              <Star className="w-4 h-4" />
              {t("home.officialInitiative")}
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-in fade-in-50 slide-in-from-bottom-6 duration-700 drop-shadow-lg">
              {t("home.title")}
              <span className="block text-2xl lg:text-4xl text-emerald-400 mt-2 font-normal">{t("home.subtitle")}</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in-50 slide-in-from-bottom-8 duration-1000 drop-shadow-md">
              {t("home.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in-50 slide-in-from-bottom-10 duration-1200">
              {/* <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="w-5 h-5 ml-2" />
                {t("home.becomePartner")}
              </Button> */}
              <Link href="/mosques">
                <Button
                  size="lg"
                  // variant="outline"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Target className="w-5 h-5 ml-2" />
                  {t("home.viewProjects")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Projects */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              {t("home.documentedProjects")}
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">{t("home.featuredProjects")}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t("home.featuredProjectsDesc")}
            </p>
          </div>

          {/* حالة التحميل */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 rounded-lg h-48 mb-4"></div>
                  <div className="bg-slate-200 rounded h-6 mb-2"></div>
                  <div className="bg-slate-200 rounded h-4 mb-4 w-3/4"></div>
                  <div className="bg-slate-200 rounded h-3 mb-2"></div>
                  <div className="bg-slate-200 rounded h-8"></div>
                </div>
              ))}
            </div>
          )}

          {/* رسالة الخطأ */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-yellow-800 mb-4">{error}</p>
                <p className="text-yellow-600 text-sm">عرض البيانات التجريبية بدلاً من ذلك</p>
              </div>
            </div>
          )}

          {/* المشاريع المميزة */}
          {!isLoading && featuredProjects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}

          {/* رسالة عدم وجود بيانات */}
          {!isLoading && featuredProjects.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-slate-600 mb-4">لا توجد مشاريع متاحة حالياً</p>
                <p className="text-slate-500 text-sm">سيتم إضافة مشاريع جديدة قريباً</p>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href="/mosques">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl bg-transparent"
              >
                <ChevronDown className="w-5 h-5 ml-2" />
                {t("home.viewAll")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 relative overflow-hidden">
        {/* Decorative Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <Sparkles className="absolute top-10 left-10 w-8 h-8 text-white opacity-20" />
          <Sparkles className="absolute top-20 right-20 w-6 h-6 text-white opacity-15" />
          <Sparkles className="absolute bottom-10 left-20 w-7 h-7 text-white opacity-25" />
          <Sparkles className="absolute bottom-20 right-10 w-5 h-5 text-white opacity-10" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t("home.becomePartnerTitle")}</h2>
            <p className="text-lg mb-8 text-emerald-100">
              {t("home.becomePartnerDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder={t("home.emailPlaceholder")}
                className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100 backdrop-blur-sm"
              />
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                {t("home.subscribeNow")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
