## حل مشاكل الاتصال بالباك اند

تم إضافة عدة حلول للتعامل مع مشاكل SSL والاتصال:

### 1. **استخدام HTTP في التطوير**
- تم إضافة `NEXT_PUBLIC_API_BASE_URL_HTTP` في ملف `.env.local`
- في بيئة التطوير، يتم استخدام HTTP بدلاً من HTTPS لتجنب مشاكل SSL

### 2. **Proxy Configuration**
- تم إضافة إعدادات proxy في `next.config.mjs`
- الـ proxy يعيد توجيه الطلبات عبر `/api/proxy/*` إلى الخادم مباشرة

### 3. **Multiple Fallback URLs**
تم برمجة النظام لتجربة عدة مسارات بالترتيب:
1. **Proxy**: `/api/proxy` (لتجنب CORS)
2. **HTTP**: `http://back-aamar.academy-lead.com/api` (لتجنب SSL)
3. **HTTPS**: `https://back-aamar.academy-lead.com/api` (الافتراضي)

### 4. **معالجة محسّنة للأخطاء**
- رسائل خطأ مخصصة حسب نوع المشكلة
- تشخيص تلقائي لأخطاء الشبكة
- معلومات مفصلة في Console للمطورين

### 5. **اختبار الاتصال**

#### **اختبار مباشر عبر cURL:**
```bash
# اختبار HTTPS
curl -X POST https://back-aamar.academy-lead.com/api/login \
     -F "email=admin@example.com" \
     -F "password=password"

# اختبار HTTP
curl -X POST http://back-aamar.academy-lead.com/api/login \
     -F "email=admin@example.com" \
     -F "password=password"
```

#### **اختبار عبر المتصفح:**
1. افتح Developer Tools (F12)
2. انتقل إلى Console
3. ستجد رسائل تشخيصية تظهر أي URL يتم تجربته

### 6. **حالات الخطأ المعالجة:**
- `ERR_CERT_COMMON_NAME_INVALID`: مشكلة شهادة SSL
- `Failed to fetch`: مشكلة شبكة عامة
- `ERR_NETWORK`: مشكلة اتصال
- `CORS`: مشكلة في إعدادات الخادم
- `401`: بيانات تسجيل دخول خاطئة
- `422`: بيانات غير صحيحة

### 7. **للمطورين - تشخيص المشاكل:**

إذا استمرت المشاكل، تحقق من:

1. **حالة الخادم:**
   ```bash
   ping back-aamar.academy-lead.com
   ```

2. **اختبار البروتوكولات:**
   ```bash
   curl -I https://back-aamar.academy-lead.com/api/login
   curl -I http://back-aamar.academy-lead.com/api/login
   ```

3. **فحص Console في المتصفح** للحصول على تفاصيل الخطأ

### 8. **في حالة عدم توفر الخادم:**
يمكن تشغيل النظام مع بيانات وهمية عبر تعديل متغير البيئة:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

**ملاحظة:** جميع هذه الحلول تطبق تلقائياً، ولا تحتاج تدخل من المستخدم.
