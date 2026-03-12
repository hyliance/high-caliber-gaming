export async function register() {
  // NextAuth 4.24+ on Vercel reads the callback URL from the request host,
  // which is the deployment-specific URL (not the stable alias).
  // Setting NEXTAUTH_URL here (before any module loads) forces the correct URL.
  if (process.env.VERCEL) {
    process.env.NEXTAUTH_URL = "https://high-caliber-gaming.vercel.app";
  }
}
