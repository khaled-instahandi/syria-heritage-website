"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LocaleSwitcher } from "@/components/ui/locale-switcher"
import { useAuth } from "@/hooks/use-auth"
import { Building2 as Mosque, Menu, X, LogIn, User } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations()
  const { isAuthenticated, user } = useAuth()

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
              <Mosque className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">إعمار</h1>
              <p className="text-xs text-slate-600">تراث سوريا</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              {t("navigation.home")}
            </Link>
            <Link href="/projects" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              {t("navigation.projects")}
            </Link>
            <Link href="/mosques" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              {t("navigation.mosques")}
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              {t("navigation.about")}
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              {t("navigation.contact")}
            </Link>
          </nav>

          {/* Language & CTA */}
          <div className="flex items-center gap-4">
            <LocaleSwitcher />

            {/* Authentication Button */}
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <User className="w-4 h-4" />
                  {t("navigation.dashboard")}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <LogIn className="w-4 h-4" />
                  {t("navigation.login")}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-200 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
                {t("navigation.home")}
              </Link>
              <Link href="/projects" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
                {t("navigation.projects")}
              </Link>
              <Link href="/mosques" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
                {t("navigation.mosques")}
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
                {t("navigation.about")}
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
                {t("navigation.contact")}
              </Link>
              <div className="pt-2">
                {/* {isAuthenticated ? ( */}
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                    <User className="w-4 h-4 ml-2" />
                    {t("navigation.dashboard")}
                  </Button>
                </Link>
                {/* ) : (
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                      <LogIn className="w-4 h-4 ml-2" />
                      {t("navigation.login")}
                    </Button>
                  </Link>
                )} */}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
