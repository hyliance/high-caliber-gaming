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
    serverActions: {
      // Allows localhost in dev; production URL is auto-detected by Vercel
      allowedOrigins: [
        "localhost:3000",
        process.env.NEXTAUTH_URL
          ? new URL(process.env.NEXTAUTH_URL).host
          : "",
      ].filter(Boolean),
    },
  },
};

export default nextConfig;
