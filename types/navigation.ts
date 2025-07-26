import { Pathnames, LocalePrefix } from 'next-intl/routing'

export const defaultLocale = 'ar' as const
export const locales = ['ar', 'en'] as const

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/about': '/about',
  '/contact': '/contact',
  '/projects': '/projects',
  '/mosques': '/mosques',
  '/dashboard': '/dashboard',
  '/login': '/login'
}

export const localePrefix: LocalePrefix<typeof locales> = 'always'

export type AppPathnames = keyof typeof pathnames
