"use client"

import { HeroSection } from "@/components/about/hero-section"
import { MissionVision } from "@/components/about/mission-vision"
import { ValuesSection } from "@/components/about/values-section"
import { ObjectivesSection } from "@/components/about/objectives-section"
import { TimelineSection } from "@/components/about/timeline-section"
import { TeamSection } from "@/components/about/team-section"
import { AchievementsSection } from "@/components/about/achievements-section"
import { Sparkles, Heart, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionVision />
      <ValuesSection />
      <ObjectivesSection />
      <TimelineSection />
      <TeamSection />
      <AchievementsSection />

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600 relative overflow-hidden">
        {/* Background decorative icons */}
        <div className="absolute inset-0">
          <Sparkles className="absolute top-20 left-20 w-8 h-8 text-white opacity-20 animate-pulse" />
          <Heart className="absolute top-40 right-32 w-6 h-6 text-white opacity-15 animate-bounce" />
          <Users className="absolute bottom-32 left-40 w-7 h-7 text-white opacity-10 animate-pulse" />
          <Sparkles className="absolute bottom-20 right-20 w-5 h-5 text-white opacity-25 animate-bounce" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Help us preserve Syria's architectural heritage for future generations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Heart className="w-5 h-5" />
              Donate Now
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105">
              <Users className="w-5 h-5" />
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
