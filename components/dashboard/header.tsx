"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LocaleSwitcher } from "@/components/ui/locale-switcher"
import { Search, Bell, User, Settings, Menu, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  title: string
  description?: string
  onMenuClick?: () => void
}

export function DashboardHeader({ title, description, onMenuClick }: DashboardHeaderProps) {
  const t = useTranslations()
  const params = useParams()
  const { user, logout } = useAuth()
  
  // Get current locale from params
  const locale = params?.locale as string || 'ar'
  const isRTL = locale === 'ar'

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section for LTR / Right Section for RTL */}
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMenuClick} 
              className="lg:hidden flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-lg lg:text-2xl font-bold text-slate-900 truncate">{title}</h1>
              {description && (
                <p className="text-slate-600 text-xs lg:text-sm mt-1 hidden sm:block truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right Section for LTR / Left Section for RTL */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            {/* Search - Hidden on mobile */}
            <div className="relative hidden lg:block">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4`} />
              <Input 
                placeholder={isRTL ? "بحث..." : "Search..."} 
                className={`${isRTL ? 'pr-10' : 'pl-10'} w-48 xl:w-64`} 
              />
            </div>

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LocaleSwitcher />
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                  <Badge className="absolute -top-1 -left-1 w-4 h-4 lg:w-5 lg:h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 lg:w-80">
                <DropdownMenuLabel>{isRTL ? "الإشعارات" : "Notifications"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{isRTL ? "تبرع جديد" : "New Donation"}</p>
                    <p className="text-sm text-slate-600">
                      {isRTL ? "تم استلام تبرع بقيمة $5,000" : "Received a donation of $5,000"}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{isRTL ? "مشروع مكتمل" : "Project Completed"}</p>
                    <p className="text-sm text-slate-600">
                      {isRTL ? "تم إكمال مسجد النور في حلب" : "Al-Noor Mosque in Aleppo completed"}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{isRTL ? "ملف جديد" : "New File"}</p>
                    <p className="text-sm text-slate-600">
                      {isRTL ? "تم رفع ملف Excel جديد للمراجعة" : "New Excel file uploaded for review"}
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <span className="hidden lg:block">{user?.name || (isRTL ? "المستخدم" : "User")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name || (isRTL ? "المستخدم" : "User")}</span>
                    <span className="text-xs text-slate-500 font-normal">{user?.email}</span>
                    {user?.role && (
                      <span className="text-xs text-emerald-600 font-normal">{user.role.role_name}</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? "الملف الشخصي" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? "الإعدادات" : "Settings"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? "تسجيل الخروج" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
