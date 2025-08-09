"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Heart } from "lucide-react"
import type { Project } from "@/lib/types"
import { getMosqueById, getGovernorateById, getDonationsByProjectId, getMainImageForMosque } from "@/lib/mock-data"
import { formatCurrency, calculateProgress } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const t = useTranslations()
  const mosque = getMosqueById(project.mosque_id)
  const governorate = mosque ? getGovernorateById(mosque.governorate_id) : null
  const donations = getDonationsByProjectId(project.id)
  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const progress = project.total_cost ? calculateProgress(totalRaised, project.total_cost) : 0
  const mainImage = mosque ? getMainImageForMosque(mosque.id) : "/placeholder.svg?height=300&width=400"

  if (!mosque) return null

  return (
    <Card
      className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="relative overflow-hidden">
        <Image
          src={project.image_url || "/placeholder.svg"}
          alt={mosque.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4">
          <Badge
            className={`${project.project_category === "إعادة إعمار" ? "bg-emerald-600" : "bg-blue-600"} text-white shadow-lg`}
          >
            {t(`projects.category.${project.project_category === "إعادة إعمار" ? "reconstruction" : "restoration"}`)}
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-slate-700 shadow-lg">
            {t(
              `projects.status.${project.status === "قيد الدراسة" ? "study" : project.status === "قيد التنفيذ" ? "progress" : "completed"}`,
            )}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
              {mosque.name}
            </h3>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{governorate?.name}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">{t("projects.progress")}</span>
            <span className="text-sm font-semibold text-emerald-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </Progress>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-slate-600">{formatCurrency(totalRaised)} {t("projects.raised")}</span>
            <span className="font-semibold text-slate-900">
              {project.total_cost ? formatCurrency(project.total_cost) : t("projects.undefined")} {t("projects.target")}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Heart className="w-4 h-4 ml-2" />
            {t("projects.donate")}
          </Button>
          <Link href={`/projects/${project.id}`}>
            <Button
              variant="outline"
              className="border-2 border-slate-300 hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300 bg-transparent"
            >
              {t("projects.viewDetails")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
