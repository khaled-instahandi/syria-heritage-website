"use client"

import React, { useState, createContext, useContext } from "react"
import { useParams } from "next/navigation"

import { DashboardSidebar } from "@/components/dashboard/sidebar"

// Context for sidebar state
const SidebarContext = createContext<{
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const params = useParams()
  
  // Get current locale from params
  const locale = params?.locale as string || 'ar'
  const isRTL = locale === 'ar'

  // Calculate margin based on sidebar state
  const getMarginClass = () => {
    if (sidebarCollapsed) {
      return isRTL ? 'lg:mr-20' : 'lg:ml-20'
    }
    return isRTL ? 'lg:mr-80' : 'lg:ml-80'
  }

  return (
    <SidebarContext.Provider value={{ 
      sidebarOpen, 
      setSidebarOpen, 
      sidebarCollapsed, 
      setSidebarCollapsed 
    }}>
      <div className="min-h-screen bg-slate-50">
        {/* Main Content */}
        <div className={`min-h-screen transition-all duration-300 ${getMarginClass()}`}>
          {children}
        </div>

        {/* Sidebar */}
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={setSidebarCollapsed}
        />
      </div>
    </SidebarContext.Provider>
  )
}
