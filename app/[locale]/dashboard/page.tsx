"use client"

import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "./layout"
import {
  Building2 as Mosque,
  DollarSign,
  TrendingUp,
  FileText,
  Upload,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Calendar,
  MapPin,
  User,
} from "lucide-react"
import {
  getStatistics,
  mockProjects,
  mockDonations,
  mockMosques,
  getMosqueById,
  getGovernorateById,
} from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  const t = useTranslations()
  const { setSidebarOpen } = useSidebar()
  const stats = getStatistics()

  const recentProjects = mockProjects.slice(0, 5)
  const recentDonations = mockDonations.slice(0, 5)
  const recentMosques = mockMosques.slice(0, 3)

  const quickActions = [
    {
      title: t("dashboard.actions.addMosque"),
      description: t("dashboard.actions.addMosqueDesc"),
      icon: Plus,
      href: "/dashboard/mosques/new",
      color: "bg-emerald-500",
    },
    {
      title: t("dashboard.actions.uploadExcel"),
      description: t("dashboard.actions.uploadExcelDesc"),
      icon: Upload,
      href: "/dashboard/import",
      color: "bg-blue-500",
    },
    {
      title: t("dashboard.actions.createReport"),
      description: t("dashboard.actions.createReportDesc"),
      icon: BarChart3,
      href: "/dashboard/reports",
      color: "bg-purple-500",
    },
    {
      title: t("dashboard.actions.manageDonations"),
      description: t("dashboard.actions.manageDonationsDesc"),
      icon: DollarSign,
      href: "/dashboard/donations",
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title={t("dashboard.title")} 
        description={t("dashboard.welcome")} 
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            title={t("dashboard.stats.totalMosques")}
            value={stats.totalMosques}
            change={{ value: "+12%", type: "increase" }}
            icon={Mosque}
            color="from-emerald-500 to-emerald-600"
            bgColor="bg-emerald-50"
            description={t("dashboard.stats.totalMosquesDesc")}
          />
          <StatsCard
            title={t("dashboard.stats.totalDonations")}
            value={formatCurrency(stats.totalDonations).replace("US$", "$")}
            change={{ value: "+8%", type: "increase" }}
            icon={DollarSign}
            color="from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
            description={t("dashboard.stats.totalDonationsDesc")}
          />
          <StatsCard
            title={t("dashboard.stats.completedMosques")}
            value={stats.completedMosques}
            change={{ value: "+25%", type: "increase" }}
            icon={TrendingUp}
            color="from-amber-500 to-amber-600"
            bgColor="bg-amber-50"
            description={t("dashboard.stats.completedMosquesDesc")}
          />
          <StatsCard
            title={t("dashboard.stats.activeProjects")}
            value={stats.activeProjects}
            change={{ value: "-3%", type: "decrease" }}
            icon={FileText}
            color="from-purple-500 to-purple-600"
            bgColor="bg-purple-50"
            description={t("dashboard.stats.activeProjectsDesc")}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6">{t("dashboard.quickActions")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <CardContent className="p-4 lg:p-6 text-center">
                    <div
                      className={`w-12 h-12 lg:w-16 lg:h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <action.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-2">{action.title}</h3>
                    <p className="text-slate-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg lg:text-xl">{t("dashboard.recent.projects")}</CardTitle>
              <Link href="/dashboard/projects">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">{t("dashboard.viewAll")}</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => {
                  const mosque = getMosqueById(project.mosque_id)
                  const governorate = mosque ? getGovernorateById(mosque.governorate_id) : null

                  return (
                    <div
                      key={project.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">{mosque?.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{governorate?.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            {formatDate(project.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <Badge
                          className={`${
                            project.status === "مكتمل"
                              ? "bg-emerald-100 text-emerald-800"
                              : project.status === "قيد التنفيذ"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {project.status}
                        </Badge>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg lg:text-xl">{t("dashboard.recent.donations")}</CardTitle>
              <Link href="/dashboard/donations">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">{t("dashboard.viewAll")}</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{donation.donor_name || t("dashboard.recent.anonymousDonor")}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-slate-600">
                          <span className="truncate">{donation.payment_method}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{formatDate(donation.donated_at || donation.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="font-bold text-emerald-600">{formatCurrency(donation.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Mosques */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg lg:text-xl">{t("dashboard.recent.mosques")}</CardTitle>
            <Link href="/dashboard/mosques">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 ml-2" />
                <span className="hidden sm:inline">{t("dashboard.manageAll")}</span>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {recentMosques.map((mosque) => {
                const governorate = getGovernorateById(mosque.governorate_id)

                return (
                  <div
                    key={mosque.id}
                    className="group p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Mosque className="w-6 h-6 text-emerald-600" />
                      </div>
                      <Badge variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"} className="text-xs">
                        {mosque.damage_level}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2 truncate">{mosque.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{governorate?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 truncate">
                        {mosque.estimated_cost ? formatCurrency(mosque.estimated_cost) : t("dashboard.recent.undefined")}
                      </span>
                      <Link href={`/dashboard/mosques/${mosque.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
