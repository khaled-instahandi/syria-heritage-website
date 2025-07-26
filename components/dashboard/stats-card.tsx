"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "increase" | "decrease"
  }
  icon: LucideIcon
  color: string
  bgColor: string
  description?: string
}

export function StatsCard({ title, value, change, icon: Icon, color, bgColor, description }: StatsCardProps) {
  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg ${bgColor}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <Badge variant={change.type === "increase" ? "default" : "destructive"} className="text-xs">
              {change.value}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-3xl font-bold text-slate-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div className="text-slate-600 font-medium">{title}</div>
          {description && <div className="text-slate-500 text-sm">{description}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
