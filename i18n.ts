import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined and fallback to 'ar' if undefined
  const currentLocale = locale || 'ar'
  
  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
  }
})
