import { getServerSession } from "@/lib/next-auth";

import { Header } from "../Header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <>
      <Header user={session?.user} />
      <main>
        <div className="container py-8 md:py-20">{children}</div>
      </main>
    </>
  );
}
