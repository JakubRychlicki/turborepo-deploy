import { redirect } from "next/navigation";
import { NAVIGATION } from "@/config/constants";
import { getServerSession } from "@/actions/auth";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect(NAVIGATION.LOGIN)
  }

  redirect(NAVIGATION.DASHBOARD);
}
