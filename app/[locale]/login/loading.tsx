import { Building2, Sparkles } from "lucide-react"

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-emerald-200 opacity-60 animate-pulse" />
        <Sparkles className="absolute top-40 right-32 w-4 h-4 text-blue-200 opacity-40 animate-bounce" />
        <Sparkles className="absolute bottom-32 left-40 w-5 h-5 text-emerald-300 opacity-50 animate-pulse" />
        <Sparkles className="absolute bottom-20 right-20 w-6 h-6 text-blue-300 opacity-30 animate-bounce" />
      </div>

      <div className="text-center relative z-10">
        <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">إحياء تراث سوريا</h1>
            <p className="text-sm text-slate-600">الحفاظ على التراث</p>
          </div>
        </div>

        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">جاري التحميل...</p>
      </div>
    </div>
  )
}
