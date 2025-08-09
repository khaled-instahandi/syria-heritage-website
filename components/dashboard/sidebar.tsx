"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useParams } from "next/navigation"
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

interface DashboardSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: (collapsed: boolean) => void
  navigateWithLoading?: (url: string) => void
}

export function DashboardSidebar({ 
  isOpen = false, 
  onClose, 
  isCollapsed = false, 
  onToggleCollapse,
  navigateWithLoading
}: DashboardSidebarProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const params = useParams()
  
  // Get current locale from params
  const locale = params?.locale as string || 'ar'
  const isRTL = locale === 'ar'

  const menuItems = [
    {
      title: t("dashboard.overview"),
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: t("dashboard.mosquesManagement"),
      href: `/${locale}/dashboard/mosques`,
      icon: Mosque,
      badge: "3",
    },
    {
      title: t("dashboard.projectsManagement"),
      href: `/${locale}/dashboard/projects`,
      icon: Building,
      badge: null,
    },
    {
      title: t("dashboard.donationsManagement"),
      href: `/${locale}/dashboard/donations`,
      icon: DollarSign,
      badge: "12",
    },
    {
      title: t("dashboard.importBatches"),
      href: `/${locale}/dashboard/import`,
      icon: Upload,
      badge: null,
    },
    {
      title: t("dashboard.mediaManagement"),
      href: `/${locale}/dashboard/media`,
      icon: ImageIcon,
      badge: null,
    },
    {
      title: t("dashboard.reports"),
      href: `/${locale}/dashboard/reports`,
      icon: BarChart3,
      badge: null,
    },
    {
      title: t("dashboard.users"),
      href: `/${locale}/dashboard/users`,
      icon: Users,
      badge: null,
    },
    {
      title: t("dashboard.settings"),
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
      badge: null,
    },
  ]

  // For mobile, use the isOpen prop, for desktop, use collapsed state from props
  const isMobileOpen = isOpen
  const isDesktopCollapsed = isCollapsed

  // Dynamic positioning based on locale
  const sidebarPosition = isRTL ? 'right-0' : 'left-0'
  const borderDirection = isRTL ? 'border-l' : 'border-r'

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${sidebarPosition} h-full bg-white ${borderDirection} border-slate-200 shadow-xl z-50 transition-all duration-300 overflow-hidden ${
          // Mobile behavior: show/hide completely
          isMobileOpen ? "w-80" : "w-0"
        } ${
          // Desktop behavior: always show but can be collapsed
          isDesktopCollapsed ? "lg:w-20" : "lg:w-80"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            {(!isDesktopCollapsed || isMobileOpen) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Mosque className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {isRTL ? "لوحة التحكم" : "Dashboard"}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {isRTL ? "إدارة المبادرة" : "Management Panel"}
                  </p>
                </div>
              </div>
            )}
            
            {/* Mobile close button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="lg:hidden flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Desktop collapse button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleCollapse?.(!isDesktopCollapsed)} 
              className="hidden lg:block"
            >
              {isDesktopCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Back to Site */}
            <Button
              onClick={() => {
                if (navigateWithLoading) {
                  navigateWithLoading(`/${locale}`)
                } else {
                  window.location.href = `/${locale}`
                }
                onClose?.()
              }}
              variant="ghost"
              className={`w-full ${isRTL ? 'justify-start' : 'justify-start'} gap-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 ${
                isDesktopCollapsed ? "lg:px-2" : "px-4"
              }`}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {(!isDesktopCollapsed || isMobileOpen) && (
                <span>{isRTL ? "العودة للموقع" : "Back to Site"}</span>
              )}
            </Button>

            <div className="border-t border-slate-200 pt-4 mt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                
                const handleNavigation = () => {
                  if (navigateWithLoading) {
                    navigateWithLoading(item.href)
                  } else {
                    window.location.href = item.href
                  }
                  onClose?.()
                }

                return (
                  <div key={item.href}>
                    <Button
                      onClick={handleNavigation}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full ${isRTL ? 'justify-start' : 'justify-start'} gap-3 mb-1 ${
                        isActive
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                      } ${isDesktopCollapsed ? "lg:px-2" : "px-4"}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {(!isDesktopCollapsed || isMobileOpen) && (
                        <>
                          <span className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className={`w-full ${isRTL ? 'justify-start' : 'justify-start'} gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${
                isDesktopCollapsed ? "lg:px-2" : "px-4"
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {(!isDesktopCollapsed || isMobileOpen) && (
                <span>{isRTL ? "تسجيل الخروج" : "Logout"}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
