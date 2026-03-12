import { redirect } from "next/navigation";

// Fallback: middleware handles /profile → /profile/:gamerTag for authenticated users.
// Unauthenticated users are redirected to /login by middleware.
// This page is a safety net for edge cases.
export default function ProfileIndexPage() {
  redirect("/dashboard");
}
