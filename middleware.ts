import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["ar", "en"],
  
  // Used when no locale matches
  defaultLocale: "ar",
  
  // Always use a locale prefix
  localePrefix: "always"
})

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
