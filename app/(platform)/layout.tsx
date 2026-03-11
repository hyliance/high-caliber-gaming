import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PlatformShell } from "@/components/layout/platform-shell";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Auth check temporarily disabled for preview/demo
  // In production, restore:
  //   const session = await getServerSession(authOptions);
  //   if (!session?.user) redirect("/login");

  return <PlatformShell>{children}</PlatformShell>;
}
