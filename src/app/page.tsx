import { redirect } from "next/navigation";
import { auth } from "../../auth";

export default async function HomePage() {
  const session = await auth();
  
  if (session?.user) {
    if ((session.user as any).role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/branch");
    }
  } else {
    redirect("/login");
  }
}
