"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign } from "lucide-react"
import {
  mockMosques,
  getGovernorateById,
  getDistrictById,
  getProjectsByMosqueId,
  getMainImageForMosque,
} from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function MosquesPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [damageFilter, setDamageFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredMosques = mockMosques.filter((mosque) => {
    const matchesSearch = searchTerm === "" || mosque.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDamage = damageFilter === "all" || mosque.damage_level === damageFilter
    const matchesStatus = statusFilter === "all" || mosque.status === statusFilter

    return matchesSearch && matchesDamage && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">{t("mosques.title")}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t("mosques.description")}</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="البحث في المساجد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={damageFilter}
              onChange={(e) => setDamageFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">جميع مستويات الضرر</option>
              <option value="جزئي">ضرر جزئي</option>
              <option value="كامل">ضرر كامل</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="موقوف">موقوف</option>
              <option value="مكتمل">مكتمل</option>
            </select>
          </div>
        </div>

        {/* Mosques Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMosques.map((mosque, index) => {
            const governorate = getGovernorateById(mosque.governorate_id)
            const district = getDistrictById(mosque.district_id)
            const projects = getProjectsByMosqueId(mosque.id)
            const mainImage = getMainImageForMosque(mosque.id)

            return (
              <Card
                key={mosque.id}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={mosque.image_url || "/placeholder.svg"}
                    alt={mosque.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"} className="shadow-lg">
                      {t(`mosques.damageLevel.${mosque.damage_level === "جزئي" ? "partial" : "complete"}`)}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-white/90 text-slate-700 shadow-lg">
                      {mosque.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {mosque.name}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {governorate?.name} - {district?.name}
                    </span>
                  </div>

                  {mosque.address_text && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{mosque.address_text}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-slate-600">التكلفة المقدرة:</span>
                    </div>
                    <span className="font-semibold text-emerald-600">
                      {mosque.estimated_cost ? formatCurrency(mosque.estimated_cost) : "غير محدد"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-slate-600">المشاريع المرتبطة:</span>
                    <Badge variant="outline">{projects.length} مشروع</Badge>
                  </div>

                  <div className="flex gap-3">
                    {projects.length > 0 && (
                      <Link href={`/projects/${projects[0].id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          عرض المشروع
                        </Button>
                      </Link>
                    )}
                    <Link href={`/mosques/${mosque.id}`}>
                      <Button
                        variant="outline"
                        className="border-2 border-slate-300 hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300 bg-transparent"
                      >
                        التفاصيل
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredMosques.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">لا توجد مساجد تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  )
}
