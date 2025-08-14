"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, Building, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })


  // إعادة توجيه إذا كان المستخدم مسجل دخول مسبقاً
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log('Attempting login with email:', formData.email)
      await login(formData.email, formData.password)
      // سيتم إعادة التوجيه تلقائياً بواسطة useAuth
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.userMessage || t("login.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* إضافة CSS للأنيميشن */}

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-emerald-200 opacity-60 animate-pulse" />
        <Sparkles className="absolute top-40 right-32 w-4 h-4 text-blue-200 opacity-40 animate-bounce" />
        <Sparkles className="absolute bottom-32 left-40 w-5 h-5 text-emerald-300 opacity-50 animate-pulse" />
        <Sparkles className="absolute bottom-20 right-20 w-6 h-6 text-blue-300 opacity-30 animate-bounce" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{t("login.brandTitle")}</h1>
              <p className="text-sm text-slate-600">{t("login.brandSubtitle")}</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{t("login.title")}</CardTitle>
            <CardDescription className="text-slate-600">{t("login.subtitle")}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top duration-300">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 whitespace-pre-line leading-relaxed">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  {t("login.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pr-10 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="admin@syria-heritage.org"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  {t("login.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10 pl-10 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-2 font-medium">{t("login.demoCredentials")}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>{t("login.adminDemo")}</p>
                  {/* <p>{t("login.userDemo")}</p> */}
                </div>
              </div>



              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("login.submitting")}</span>
                  </div>
                ) : (
                  t("login.submit")
                )}
              </Button>
            </form>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                {t("login.backHome")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
