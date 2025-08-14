"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { HeroSection } from "@/components/about/hero-section"
import { MissionVision } from "@/components/about/mission-vision"
import { ValuesSection } from "@/components/about/values-section"
import { ObjectivesSection } from "@/components/about/objectives-section"
import { TimelineSection } from "@/components/about/timeline-section"
import { TeamSection } from "@/components/about/team-section"
import { AchievementsSection } from "@/components/about/achievements-section"
import { Sparkles, Heart, Users, BookOpen, X, Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const t = useTranslations()
  const [isVersesDialogOpen, setIsVersesDialogOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionVision />
      <ValuesSection />
      <ObjectivesSection />
      {/* <TimelineSection />
      <TeamSection /> */}
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("about.joinMission")}</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            {t("about.joinMissionDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Heart className="w-5 h-5" />
              {t("about.donateNow")}
            </button>
            {/* <button className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105">
              <Users className="w-5 h-5" />
              {t("about.becomeVolunteer")}
            </button> */}
          </div>
        </div>
      </section>

      {/* زر الآيات والأحاديث العائم */}
      <button
        onClick={() => setIsVersesDialogOpen(true)}
        className="fixed bottom-8 right-8 z-50 group"
        aria-label="الآيات والأحاديث في فضل إعمار المساجد"
      >
        <div className="relative">
          {/* تأثير الهالة */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
          
          {/* الزر الرئيسي */}
          <div className="relative bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
            <BookOpen className="w-6 h-6" />
          </div>
          
          {/* النجوم المتحركة */}
          <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
          <Star className="absolute -bottom-1 -left-1 w-2 h-2 text-yellow-300 animate-bounce" />
        </div>
        
        {/* التولتيب */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            الآيات والأحاديث في فضل إعمار المساجد
            <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      </button>

      {/* نافذة الآيات والأحاديث */}
      <Dialog open={isVersesDialogOpen} onOpenChange={setIsVersesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-2xl font-bold text-emerald-800 flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              الآيات والأحاديث الواردة في فضل إعمار المساجد
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* القرآن الكريم */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
              <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-600" />
                أولاً: من القرآن الكريم
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-5 shadow-sm border-r-4 border-emerald-500">
                  <div className="text-lg font-semibold text-slate-800 mb-3 leading-relaxed text-right">
                    ﴿إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ فَعَسَىٰ أُو۟لَٰئِكَ أَن يَكُونُوا۟ مِنَ ٱلْمُهْتَدِينَ﴾
                  </div>
                  <p className="text-sm text-emerald-600 font-medium mb-2">[التوبة: 18]</p>
                  <p className="text-slate-600 text-sm">
                    الآية تبين أن عمارة المساجد (بالبناء أو الرعاية) علامة على صدق الإيمان ورجاء الهداية.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border-r-4 border-blue-500">
                  <div className="text-lg font-semibold text-slate-800 mb-3 leading-relaxed text-right">
                    ﴿فِي بُيُوتٍ أَذِنَ اللَّهُ أَنْ تُرْفَعَ وَيُذْكَرَ فِيهَا اسْمُهُ يُسَبِّحُ لَهُ فِيهَا بِالْغُدُوِّ وَالْآصَالِ﴾
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-2">[النور: 36]</p>
                  <p className="text-slate-600 text-sm">
                    أي أن الله شرّف المساجد وأذن أن تُبنى وتُرفع لتكون محاضن للذكر والعبادة.
                  </p>
                </div>
              </div>
            </div>

            {/* السنة النبوية */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                ثانياً: من السنة النبوية
              </h3>
              
              <div className="space-y-5">
                <div className="bg-white rounded-lg p-5 shadow-sm border-r-4 border-amber-500">
                  <p className="text-slate-700 font-medium mb-2">عن عثمان بن عفان رضي الله عنه قال: قال رسول الله ﷺ:</p>
                  <div className="text-lg font-semibold text-slate-800 mb-2 text-right bg-amber-50 p-3 rounded">
                    «مَن بَنَى لِلَّهِ مَسْجِدًا، بَنَى اللَّهُ لَهُ مِثْلَهُ في الجَنَّةِ»
                  </div>
                  <p className="text-sm text-amber-600">رواه البخاري (450) ومسلم (533).</p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border-r-4 border-orange-500">
                  <p className="text-slate-700 font-medium mb-2">عن جابر بن عبد الله رضي الله عنهما قال: قال رسول الله ﷺ:</p>
                  <div className="text-lg font-semibold text-slate-800 mb-2 text-right bg-orange-50 p-3 rounded">
                    «مَن بَنَى مَسْجِدًا لِلَّهِ كَمَفْحَصِ قَطَاةٍ أو أَصْغَرَ، بَنَى اللَّهُ له بَيْتًا في الجَنَّةِ»
                  </div>
                  <p className="text-sm text-orange-600">رواه ابن ماجه (738) وصححه الألباني.</p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border-r-4 border-emerald-500">
                  <p className="text-slate-700 font-medium mb-2">عن أنس بن مالك رضي الله عنه أن رسول الله ﷺ قال:</p>
                  <div className="text-lg font-semibold text-slate-800 mb-2 text-right bg-emerald-50 p-3 rounded">
                    «مَن بَنَى لِلَّهِ مَسْجِدًا صَغِيرًا كانَ أو كَبِيرًا، بَنَى اللَّهُ له بَيْتًا في الجَنَّةِ»
                  </div>
                  <p className="text-sm text-emerald-600">رواه الترمذي (318) وصححه الألباني.</p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border-r-4 border-purple-500">
                  <p className="text-slate-700 font-medium mb-2">عن عائشة رضي الله عنها قالت:</p>
                  <div className="text-lg font-semibold text-slate-800 mb-2 text-right bg-purple-50 p-3 rounded">
                    أمر رسول الله ﷺ ببناء المساجد في الدور وأن تُنظف وتُطيّب.
                  </div>
                  <p className="text-sm text-purple-600">رواه أبو داود (455) والترمذي (594) وصححه الألباني.</p>
                </div>
              </div>
            </div>

            {/* الخلاصة */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-slate-600" />
                خلاصة
              </h3>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">بناء المسجد أو المشاركة فيه سبب لنيل بيت في الجنة.</p>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">عمارة المسجد تشمل البناء، الصيانة، التنظيف، التطييب، والرعاية.</p>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">إعمار المساجد عمل يدل على صدق الإيمان ويجعل صاحبه من أهل الهداية.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-6">
            <Button 
              onClick={() => setIsVersesDialogOpen(false)}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-2"
            >
              <Heart className="w-4 h-4 ml-2" />
              بارك الله فيكم
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
