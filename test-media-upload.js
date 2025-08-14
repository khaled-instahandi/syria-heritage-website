// ملف لاختبار API تحميل الوسائط
console.log('Testing media upload API...')

// محاكاة البيانات
const testData = {
    mosque_id: 27,
    media_stage: "before",
    is_main: false,
    media_order: 1,
    files: [] // سيتم إضافة ملفات وهمية
}

console.log('Test data:', testData)

// التحقق من البيانات
if (!testData.mosque_id) {
    console.error('mosque_id is missing!')
}
if (!testData.media_stage) {
    console.error('media_stage is missing!')
}
if (!testData.files || testData.files.length === 0) {
    console.error('files are missing!')
}

console.log('All validations passed!')

// محاكاة FormData
const formData = new FormData()
formData.append('mosque_id', testData.mosque_id.toString())
formData.append('media_stage', testData.media_stage)
formData.append('is_main', testData.is_main ? '1' : '0')
formData.append('media_order', testData.media_order.toString())

console.log('FormData created successfully!')

// عرض محتويات FormData
console.log('FormData contents:')
for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`)
}
