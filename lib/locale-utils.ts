/**
 * Utility functions for locale switching
 */

export function switchLocalePath(currentPath: string, currentLocale: string, targetLocale: string): string {
  console.log('switchLocalePath debug:', { currentPath, currentLocale, targetLocale })
  
  // Split path and filter empty segments
  const segments = currentPath.split('/').filter(Boolean)
  
  console.log('segments:', segments)
  
  // Check if first segment is the current locale
  if (segments.length > 0 && segments[0] === currentLocale) {
    // Replace the locale
    segments[0] = targetLocale
  } else if (segments.length === 0 || !['ar', 'en'].includes(segments[0])) {
    // No locale in path or invalid locale, add target locale
    segments.unshift(targetLocale)
  }
  
  // Rebuild path
  const newPath = '/' + segments.join('/')
  console.log('new path:', newPath)
  
  return newPath
}

export function getPathWithoutLocale(path: string, locale: string): string {
  const segments = path.split('/').filter(Boolean)
  
  if (segments[0] === locale) {
    return '/' + segments.slice(1).join('/')
  }
  
  return path
}

export function addLocaleToPath(path: string, locale: string): string {
  // Clean the path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // If path is empty, just return the locale
  if (!cleanPath) {
    return `/${locale}`
  }
  
  // Add locale to the beginning
  return `/${locale}/${cleanPath}`
}
