/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Optimizes for container deployments
  typescript: {
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig