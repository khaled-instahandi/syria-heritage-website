"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Main Content */}
      <div className="flex-1 lg:mr-80">{children}</div>

      {/* Sidebar */}
      <DashboardSidebar />
    </div>
  )
}
