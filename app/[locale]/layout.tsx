import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Cairo } from "next/font/google"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const cairo = Cairo({ 
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return {
    title: locale === 'ar' ? 'إحياء مساجد سوريا' : 'Reviving Syria\'s Heritage',
    description: locale === 'ar' 
      ? 'حملة لتوثيق إنجازات ترميم المساجد السورية' 
      : 'Initiative to document Syrian mosque restoration achievements',
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Ensure we have messages for the given locale
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={cairo.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {children}
            <Toaster 
              position={locale === "ar" ? "top-left" : "top-right"}
              richColors
              closeButton
            />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
