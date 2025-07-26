"use client"

import { useTranslations } from "next-intl"
import { Users, Mail, Linkedin, Twitter, Sparkles, Star } from "lucide-react"

export function TeamSection() {
  const t = useTranslations("about")

  const teamMembers = [
    { key: "director", role: "director" },
    { key: "architect", role: "architect" },
    { key: "historian", role: "historian" },
    { key: "developer", role: "developer" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">{t("team.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("team.title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("team.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={member.key} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative p-6 text-center h-full">
                {/* Background decorative icons */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <Sparkles className="absolute top-3 right-3 w-4 h-4 text-purple-200 opacity-40" />
                  <Star className="absolute bottom-3 left-3 w-3 h-3 text-blue-200 opacity-50" />
                </div>

                <div className="relative z-10">
                  {/* Avatar placeholder */}
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{t(`team.members.${member.key}.name`)}</h3>
                  <p className="text-purple-600 font-medium mb-3">{t(`team.members.${member.key}.role`)}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{t(`team.members.${member.key}.bio`)}</p>

                  {/* Social links */}
                  <div className="flex justify-center gap-3">
                    <button className="p-2 bg-white rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-sm">
                      <Mail className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-sm">
                      <Linkedin className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-sm">
                      <Twitter className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
