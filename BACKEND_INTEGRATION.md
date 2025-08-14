# نظام إدارة الباك اند - سوريا المساجد

تم إنشاء نظام شامل للتعامل مع الباك اند، المصادقة، وإدارة البيانات في مشروع سوريا المساجد.

## الملفات المضافة

### 1. `lib/api.ts`
ملف إدارة API الرئيسي الذي يحتوي على:
- فئة `ApiClient` للتعامل مع جميع طلبات HTTP
- إدارة التوثيق والتوكنز تلقائياً
- معالجة الأخطاء وعرضها باستخدام Toast
- طرق للطلبات: GET, POST, PUT, DELETE, POST مع FormData
- دالة تسجيل الدخول والخروج

### 2. `hooks/use-auth.tsx`
Hook للمصادقة يحتوي على:
- `AuthProvider` لإدارة حالة المصادقة في التطبيق
- `useAuth` للوصول لبيانات المستخدم الحالي
- `useRequireAuth` لحماية الصفحات التي تتطلب تسجيل دخول
- `usePermissions` للتحكم في الصلاحيات

### 3. `components/protected-route.tsx`
مكونات الحماية:
- `ProtectedRoute` للحماية العامة
- `AuthProtectedRoute` للحماية بتسجيل الدخول
- `AdminProtectedRoute` للحماية بصلاحيات الإدارة

### 4. `lib/services.ts`
خدمات البيانات المتخصصة:
- `MosquesService` لإدارة المساجد
- `ProjectsService` لإدارة المشاريع
- `DonationsService` لإدارة التبرعات
- `StatisticsService` لإدارة الإحصائيات
- `GovernoratesService` لإدارة المحافظات
- `FileUploadService` لرفع الملفات

### 5. `hooks/use-toast-messages.tsx`
نظام عرض الرسائل:
- رسائل النجاح والخطأ والتحذير
- رسائل التحميل
- رسائل الأخطاء المخصصة
- معالجة أخطاء التحقق من البيانات

### 6. `.env.local`
إعدادات البيئة للمشروع

## كيفية الاستخدام

### 1. تسجيل الدخول

```tsx
import { useAuth } from '@/hooks/use-auth'

function LoginComponent() {
  const { login, isLoading } = useAuth()
  
  const handleLogin = async () => {
    try {
      await login('admin@example.com', 'password')
      // سيتم إعادة التوجيه تلقائياً للـ dashboard
    } catch (error) {
      // سيتم عرض رسالة الخطأ تلقائياً
    }
  }
}
```

### 2. حماية الصفحات

```tsx
import { AuthProtectedRoute } from '@/components/protected-route'

function DashboardPage() {
  return (
    <AuthProtectedRoute>
      <div>محتوى الصفحة المحمية</div>
    </AuthProtectedRoute>
  )
}
```

### 3. استخدام الخدمات

```tsx
import { MosquesService } from '@/lib/services'
import { useToast } from '@/hooks/use-toast-messages'

function MosquesComponent() {
  const toast = useToast()
  
  const loadMosques = async () => {
    try {
      const response = await MosquesService.getAll()
      if (response.status === 'success') {
        setMosques(response.data.data)
      }
    } catch (error) {
      toast.error('فشل في تحميل البيانات')
    }
  }
}
```

### 4. عرض الرسائل

```tsx
import { useToast } from '@/hooks/use-toast-messages'

function MyComponent() {
  const toast = useToast()
  
  const handleSave = async () => {
    const loadingToast = toast.loading('جاري الحفظ...')
    
    try {
      await saveData()
      toast.dismissLoading(loadingToast, 'تم الحفظ بنجاح')
    } catch (error) {
      toast.dismissWithError(loadingToast, 'فشل في الحفظ')
    }
  }
}
```

### 5. طلبات API مباشرة

```tsx
import { api } from '@/lib/api'

// GET request
const data = await api.get('/mosques')

// POST request
const result = await api.post('/mosques', mosquesData)

// POST with FormData
const formData = new FormData()
formData.append('file', file)
const result = await api.postForm('/upload', formData)
```

## المميزات

### 1. إدارة التوثيق التلقائي
- حفظ التوكن في localStorage
- إرسال التوكن مع كل طلب تلقائياً
- تسجيل الخروج التلقائي عند انتهاء الصلاحية

### 2. معالجة الأخطاء
- عرض رسائل الخطأ تلقائياً باستخدام Toast
- معالجة أخطاء الشبكة
- معالجة أخطاء التحقق من البيانات
- معالجة أخطاء عدم الصلاحية

### 3. نظام الرسائل المتقدم
- رسائل ملونة حسب النوع
- رسائل قابلة للإغلاق
- رسائل مع أزرار إجراءات
- رسائل التحميل

### 4. حماية الصفحات
- حماية بناءً على تسجيل الدخول
- حماية بناءً على الأدوار
- إعادة التوجيه التلقائي

### 5. خدمات متخصصة
- خدمات منظمة لكل نوع بيانات
- طرق محددة لكل عملية
- معالجة Parameters والـ Query strings
- دعم رفع الملفات

## إعدادات البيئة

قم بتحديث `.env.local` بالقيم الصحيحة:

```env
NEXT_PUBLIC_API_BASE_URL=https://back-aamar.academy-lead.com/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## الملفات المحدثة

1. **`app/[locale]/layout.tsx`** - تم إضافة AuthProvider و Toaster
2. **`app/[locale]/login/page.tsx`** - تم تحديثها لاستخدام النظام الجديد
3. **`app/[locale]/dashboard/layout.tsx`** - تم إضافة حماية المصادقة
4. **`components/dashboard/header.tsx`** - تم إضافة زر تسجيل الخروج ومعلومات المستخدم

## الاستخدام في المستقبل

يمكن توسيع النظام بسهولة من خلال:
1. إضافة خدمات جديدة في `lib/services.ts`
2. إضافة طرق مصادقة جديدة في `lib/api.ts`
3. إضافة مكونات حماية مخصصة
4. توسيع نظام الرسائل

## نصائح مهمة

1. **استخدم دائماً الخدمات المتخصصة** بدلاً من API المباشر للعمليات المعقدة
2. **استخدم نظام الرسائل** لتحسين تجربة المستخدم
3. **احمِ جميع الصفحات الحساسة** باستخدام مكونات الحماية
4. **اختبر دائماً معالجة الأخطاء** في جميع السيناريوهات

## الأمان

- التوكنز محفوظة بشكل آمن في localStorage
- جميع الطلبات محمية بالتوثيق
- معالجة آمنة للأخطاء دون كشف معلومات حساسة
- تسجيل خروج تلقائي عند انتهاء الصلاحية
