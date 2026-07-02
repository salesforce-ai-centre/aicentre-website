/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'ca.slack-edge.com',
      },
      {
        protocol: 'https',
        hostname: 'ai-centre-uk.file.force.com',
      },
      {
        protocol: 'https',
        hostname: 'files.slack.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async redirects() {
    return [
      { source: '/workshops', destination: '/discover', permanent: true },
      { source: '/journey', destination: '/discover', permanent: true },
      { source: '/keynotes', destination: '/discover', permanent: true },
      { source: '/team', destination: '/discover', permanent: true },
      { source: '/plan-engagement', destination: '/tiers', permanent: true },
    ];
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react'],
  },
  trailingSlash: false,
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

module.exports = nextConfig