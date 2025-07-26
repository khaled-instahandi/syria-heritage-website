"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Palette,
  Save,
  RefreshCw,
  Key,
  Download,
  Upload,
} from "lucide-react"
import { useTranslations } from "next-intl"

export default function SettingsPage() {
  const t = useTranslations('dashboard')
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    reports: true,
  })

  const settingsTabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "security", label: "الأمان", icon: Shield },
    { id: "system", label: "النظام", icon: Settings },
    { id: "backup", label: "النسخ الاحتياطي", icon: Database },
    { id: "appearance", label: "المظهر", icon: Palette },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader title={t("dashboard.settings")} description="إعدادات النظام والحساب الشخصي" />

      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">الإعدادات</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
                      activeTab === tab.id
                        ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    الملف الشخصي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 ml-2" />
                        تغيير الصورة
                      </Button>
                      <p className="text-sm text-slate-600">JPG, PNG أو GIF (الحد الأقصى 2MB)</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">الاسم الكامل</label>
                      <Input defaultValue="أحمد محمد الأسعد" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
                      <Input defaultValue="admin@awqaf.gov.sy" type="email" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">رقم الهاتف</label>
                      <Input defaultValue="+963-11-1234567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">المنصب</label>
                      <Input defaultValue="مدير المبادرة" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">نبذة شخصية</label>
                    <Textarea
                      rows={4}
                      defaultValue="مدير مبادرة إحياء تراث سوريا، مهندس معماري متخصص في التراث الإسلامي مع خبرة 15 عام في مجال ترميم وإعادة إعمار المساجد التاريخية."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 ml-2" />
                      إعادة تعيين
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    إعدادات الإشعارات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">إشعارات البريد الإلكتروني</h4>
                        <p className="text-sm text-slate-600">تلقي الإشعارات عبر البريد الإلكتروني</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">الإشعارات الفورية</h4>
                        <p className="text-sm text-slate-600">إشعارات فورية في المتصفح</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">رسائل SMS</h4>
                        <p className="text-sm text-slate-600">تلقي الإشعارات المهمة عبر الرسائل النصية</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">تقارير دورية</h4>
                        <p className="text-sm text-slate-600">تلقي التقارير الأسبوعية والشهرية</p>
                      </div>
                      <Switch
                        checked={notifications.reports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, reports: checked })}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-slate-900 mb-4">تخصيص الإشعارات</h4>
                    <div className="space-y-3">
                      {[
                        "تبرع جديد",
                        "مشروع مكتمل",
                        "ملف مستورد",
                        "تحديث حالة مشروع",
                        "تقرير شهري جاهز",
                        "تنبيه أمني",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{item}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-slate-100">
                              <Mail className="w-3 h-3 ml-1" />
                              إيميل
                            </Badge>
                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-slate-100">
                              <Bell className="w-3 h-3 ml-1" />
                              فوري
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ إعدادات الإشعارات
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    إعدادات الأمان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      <h4 className="font-medium text-amber-900">حالة الأمان</h4>
                    </div>
                    <p className="text-sm text-amber-800">حسابك محمي بكلمة مرور قوية ومصادقة ثنائية</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">تغيير كلمة المرور</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الحالية</label>
                          <Input type="password" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الجديدة</label>
                          <Input type="password" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">تأكيد كلمة المرور</label>
                          <Input type="password" />
                        </div>
                        <Button variant="outline">
                          <Key className="w-4 h-4 ml-2" />
                          تحديث كلمة المرور
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium text-slate-900 mb-4">المصادقة الثنائية</h4>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">تفعيل المصادقة الثنائية</h5>
                          <p className="text-sm text-slate-600">حماية إضافية لحسابك</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium text-slate-900 mb-4">الجلسات النشطة</h4>
                      <div className="space-y-3">
                        {[
                          { device: "Chrome على Windows", location: "دمشق، سوريا", time: "نشط الآن", current: true },
                          { device: "Safari على iPhone", location: "دمشق، سوريا", time: "منذ ساعتين", current: false },
                          { device: "Firefox على Linux", location: "حلب، سوريا", time: "منذ يوم", current: false },
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-slate-900">{session.device}</h5>
                                {session.current && (
                                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">حالي</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">
                                {session.location} • {session.time}
                              </p>
                            </div>
                            {!session.current && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                إنهاء الجلسة
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Settings */}
            {activeTab === "system" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إعدادات النظام
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">اللغة والمنطقة</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">اللغة</label>
                          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">المنطقة الزمنية</label>
                          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="asia/damascus">آسيا/دمشق (GMT+3)</option>
                            <option value="utc">UTC (GMT+0)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">تنسيق البيانات</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">تنسيق التاريخ</label>
                          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="dd/mm/yyyy">يوم/شهر/سنة</option>
                            <option value="mm/dd/yyyy">شهر/يوم/سنة</option>
                            <option value="yyyy-mm-dd">سنة-شهر-يوم</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">العملة</label>
                          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="usd">دولار أمريكي (USD)</option>
                            <option value="eur">يورو (EUR)</option>
                            <option value="syp">ليرة سورية (SYP)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-slate-900 mb-4">إعدادات الأداء</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">تحسين الأداء</h5>
                          <p className="text-sm text-slate-600">تحسين سرعة تحميل الصفحات</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">ضغط البيانات</h5>
                          <p className="text-sm text-slate-600">تقليل استهلاك البيانات</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">التحديث التلقائي</h5>
                          <p className="text-sm text-slate-600">تحديث البيانات تلقائياً</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ إعدادات النظام
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Backup Settings */}
            {activeTab === "backup" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    النسخ الاحتياطي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">آخر نسخة احتياطية</h4>
                    </div>
                    <p className="text-sm text-blue-800">تم إنشاء آخر نسخة احتياطية في 15 يناير 2024 الساعة 3:00 ص</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">النسخ الاحتياطي التلقائي</h4>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">تفعيل النسخ التلقائي</h5>
                          <p className="text-sm text-slate-600">إنشاء نسخة احتياطية يومياً</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">تكرار النسخ الاحتياطي</h4>
                      <select className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="daily">يومياً</option>
                        <option value="weekly">أسبوعياً</option>
                        <option value="monthly">شهرياً</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Database className="w-4 h-4 ml-2" />
                        إنشاء نسخة احتياطية الآن
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 ml-2" />
                        تحميل آخر نسخة
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-slate-900 mb-4">النسخ الاحتياطية المحفوظة</h4>
                    <div className="space-y-3">
                      {[
                        { date: "15 يناير 2024", size: "45.2 MB", type: "تلقائي" },
                        { date: "14 يناير 2024", size: "44.8 MB", type: "تلقائي" },
                        { date: "13 يناير 2024", size: "44.1 MB", type: "يدوي" },
                      ].map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium text-slate-900">{backup.date}</h5>
                            <p className="text-sm text-slate-600">
                              {backup.size} • {backup.type}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              استرداد
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    إعدادات المظهر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">المظهر العام</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {["فاتح", "داكن", "تلقائي"].map((theme, index) => (
                        <div
                          key={index}
                          className="p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"
                        >
                          <div className="w-full h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded mb-3"></div>
                          <p className="text-center font-medium">{theme}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">الألوان الأساسية</h4>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        "bg-emerald-500",
                        "bg-blue-500",
                        "bg-purple-500",
                        "bg-amber-500",
                        "bg-rose-500",
                        "bg-slate-500",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className={`w-12 h-12 ${color} rounded-lg cursor-pointer hover:scale-110 transition-transform`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">خيارات العرض</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">الشريط الجانبي المضغوط</h5>
                          <p className="text-sm text-slate-600">عرض الشريط الجانبي بشكل مضغوط</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">الرسوم المتحركة</h5>
                          <p className="text-sm text-slate-600">تفعيل التأثيرات المتحركة</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">الخط الكبير</h5>
                          <p className="text-sm text-slate-600">استخدام خط أكبر لسهولة القراءة</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ إعدادات المظهر
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
