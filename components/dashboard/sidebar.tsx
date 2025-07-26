"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2 as Mosque,
  LayoutDashboard,
  Building,
  DollarSign,
  Upload,
  BarChart3,
  Users,
  Settings,
  ImageIcon,
  Menu,
  X,
  LogOut,
  Home,
} from "lucide-react"

export function DashboardSidebar() {
  const t = useTranslations()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      title: t("dashboard.overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: t("dashboard.mosquesManagement"),
      href: "/dashboard/mosques",
      icon: Mosque,
      badge: "3",
    },
    {
      title: t("dashboard.projectsManagement"),
      href: "/dashboard/projects",
      icon: Building,
      badge: null,
    },
    {
      title: t("dashboard.donationsManagement"),
      href: "/dashboard/donations",
      icon: DollarSign,
      badge: "12",
    },
    {
      title: t("dashboard.importBatches"),
      href: "/dashboard/import",
      icon: Upload,
      badge: null,
    },
    {
      title: t("dashboard.mediaManagement"),
      href: "/dashboard/media",
      icon: ImageIcon,
      badge: null,
    },
    {
      title: t("dashboard.reports"),
      href: "/dashboard/reports",
      icon: BarChart3,
      badge: null,
    },
    {
      title: t("dashboard.users"),
      href: "/dashboard/users",
      icon: Users,
      badge: null,
    },
    {
      title: t("dashboard.settings"),
      href: "/dashboard/settings",
      icon: Settings,
      badge: null,
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-xl z-50 transition-all duration-300 ${
          isCollapsed ? "w-0 lg:w-20" : "w-80 lg:w-80"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Mosque className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">لوحة التحكم</h2>
                  <p className="text-xs text-slate-600">إدارة المبادرة</p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden">
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Back to Site */}
            <Link href="/">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 ${
                  isCollapsed ? "px-2" : "px-4"
                }`}
              >
                <Home className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>العودة للموقع</span>}
              </Button>
            </Link>

            <div className="border-t border-slate-200 pt-4 mt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 mb-1 ${
                        isActive
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                      } ${isCollapsed ? "px-2" : "px-4"}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-right">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${
                isCollapsed ? "px-2" : "px-4"
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>تسجيل الخروج</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
