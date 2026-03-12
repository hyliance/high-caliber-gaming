import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileIndexPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.gamerTag) redirect("/dashboard");
  redirect(`/profile/${session.user.gamerTag}`);
}
