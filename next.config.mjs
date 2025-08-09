import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg", "back-aamar.academy-lead.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http", 
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  // إعدادات للتعامل مع مشاكل CORS و SSL في التطوير
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://back-aamar.academy-lead.com/api/:path*',
      },
    ]
  },
}

export default withNextIntl(nextConfig)
