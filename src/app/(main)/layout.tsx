import { Footer } from "@/components/Footer";
import { getServerSession } from "@/lib/next-auth";

import { Header } from "../../components/Header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session?.user} />
      <main className="flex-grow">
        <div className="container py-8 md:pb-24">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
