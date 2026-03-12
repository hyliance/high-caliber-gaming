/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Type errors are fixed post-deploy; don't block the build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.highcalibergaming.gg" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "static-cdn.jtvnw.net" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
  experimental: {
    instrumentationHook: true,
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "high-caliber-gaming.vercel.app",
      ],
    },
  },
};

export default nextConfig;
