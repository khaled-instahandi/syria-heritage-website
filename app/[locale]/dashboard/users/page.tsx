"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Trash2, Filter, Download, User, Shield, Calendar, Mail, Phone, MapPin, Activity, UserCheck, UserX } from 'lucide-react'
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "أحمد محمد علي",
    email: "ahmed.mohamed@syria-heritage.org",
    phone: "+963-11-1234567",
    role: "admin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "دمشق، سوريا",
    lastLogin: "2024-01-20T14:30:00Z",
    createdAt: "2023-06-15T10:00:00Z",
    projectsCount: 15,
    donationsCount: 8,
    totalDonated: 50000,
  },
  {
    id: 2,
    name: "سارة أحمد حسن",
    email: "sara.ahmed@syria-heritage.org",
    phone: "+963-21-2345678",
    role: "editor",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "حلب، سوريا",
    lastLogin: "2024-01-19T16:45:00Z",
    createdAt: "2023-08-20T09:30:00Z",
    projectsCount: 8,
    donationsCount: 12,
    totalDonated: 25000,
  },
  {
    id: 3,
    name: "محمد علي حسين",
    email: "mohamed.ali@gmail.com",
    phone: "+963-31-3456789",
    role: "user",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "حمص، سوريا",
    lastLogin: "2024-01-18T12:20:00Z",
    createdAt: "2023-09-10T14:15:00Z",
    projectsCount: 0,
    donationsCount: 25,
    totalDonated: 75000,
  },
  {
    id: 4,
    name: "فاطمة خالد محمد",
    email: "fatima.khaled@hotmail.com",
    phone: "+963-41-4567890",
    role: "user",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "اللاذقية، سوريا",
    lastLogin: "2024-01-10T08:30:00Z",
    createdAt: "2023-11-05T11:45:00Z",
    projectsCount: 0,
    donationsCount: 5,
    totalDonated: 15000,
  },
  {
    id: 5,
    name: "عبد الرحمن يوسف",
    email: "abdelrahman.youssef@yahoo.com",
    phone: "+963-51-5678901",
    role: "user",
    status: "suspended",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "طرطوس، سوريا",
    lastLogin: "2024-01-05T19:15:00Z",
    createdAt: "2023-12-01T16:20:00Z",
    projectsCount: 0,
    donationsCount: 2,
    totalDonated: 5000,
  },
]

export default function UsersManagementPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const userStats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === "active").length,
    inactive: mockUsers.filter((u) => u.status === "inactive").length,
    suspended: mockUsers.filter((u) => u.status === "suspended").length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
    editors: mockUsers.filter((u) => u.role === "editor").length,
    users: mockUsers.filter((u) => u.role === "user").length,
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-600" />
      case "editor":
        return <Edit className="w-4 h-4 text-blue-600" />
      case "user":
        return <User className="w-4 h-4 text-emerald-600" />
      default:
        return <User className="w-4 h-4 text-slate-600" />
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "مدير"
      case "editor":
        return "محرر"
      case "user":
        return "مستخدم"
      default:
        return "غير محدد"
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "active":
        return "مفعل"
      case "inactive":
        return "غير مفعل"
      case "suspended":
        return "موقوف"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="إدارة المستخدمين" description="إدارة حسابات المستخدمين والصلاحيات" />

      <div className="p-6 space-y-6">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي المستخدمين</p>
                  <p className="text-3xl font-bold text-slate-900">{userStats.total}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="text-red-600">مدراء: {userStats.admins}</span>
                    <span className="text-blue-600">محررين: {userStats.editors}</span>
                    <span className="text-emerald-600">مستخدمين: {userStats.users}</span>
                  </div>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">المستخدمين المفعلين</p>
                  <p className="text-3xl font-bold text-slate-900">{userStats.active}</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {Math.round((userStats.active / userStats.total) * 100)}% من الإجمالي
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">غير المفعلين</p>
                  <p className="text-3xl font-bold text-slate-900">{userStats.inactive}</p>
                  <p className="text-xs text-amber-600 mt-1">يحتاجون متابعة</p>
                </div>
                <Activity className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">الموقوفين</p>
                  <p className="text-3xl font-bold text-slate-900">{userStats.suspended}</p>
                  <p className="text-xs text-red-600 mt-1">حسابات معلقة</p>
                </div>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في المستخدمين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="admin">مدير</option>
                  <option value="editor">محرر</option>
                  <option value="user">مستخدم</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">مفعل</option>
                  <option value="inactive">غير مفعل</option>
                  <option value="suspended">موقوف</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
                </Button>
                <Link href="/dashboard/users/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 ml-2" />
                    مستخدم جديد
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">الدور</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">النشاط</TableHead>
                    <TableHead className="text-right">آخر دخول</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                user.status === "active"
                                  ? "bg-emerald-500"
                                  : user.status === "inactive"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                            <div className="text-sm text-slate-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <Badge
                            className={`${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.role === "editor"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {getRoleName(user.role)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            user.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : user.status === "inactive"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getStatusName(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{user.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>مشاريع: {user.projectsCount}</div>
                          <div>تبرعات: {user.donationsCount}</div>
                          <div className="text-emerald-600 font-semibold">
                            {user.totalDonated.toLocaleString()} ل.س
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(user.lastLogin)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/users/${user.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/users/${user.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${
                              user.status === "suspended"
                                ? "text-emerald-600 hover:text-emerald-700"
                                : "text-amber-600 hover:text-amber-700"
                            }`}
                          >
                            {user.status === "suspended" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">لا توجد مستخدمين يطابقون معايير البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
