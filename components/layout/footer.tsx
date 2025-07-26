"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Building2 as Mosque } from "lucide-react"

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <Mosque className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">إعمار</h3>
                <p className="text-emerald-400">تراث سوريا</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              ساهم في إعادة إعمار المساجد التاريخية وإحياء التراث الثقافي السوري
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/projects" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  مشاريعنا الحالية
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?status=completed"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  مشاريع مكتملة
                </Link>
              </li>
              <li>
                <Link href="/projects?status=study" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  مشاريع بحاجة
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?featured=true"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  مشاريع مميزة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">تواصل معنا</h4>
            <div className="space-y-3 text-slate-300">
              <p>وزارة الأوقاف</p>
              <p>دمشق - سوريا</p>
              <p>eng-requests@awqaf.gov.sy</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">تابعنا</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-700 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-sm">f</span>
              </div>
              <div className="w-10 h-10 bg-slate-700 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-sm">t</span>
              </div>
              <div className="w-10 h-10 bg-slate-700 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>© 2025 مبادرة إعمار إعادة المساجد السورية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
