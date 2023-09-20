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
        <div className="container my-8 md:my-20">{children}</div>
      </main>
    </>
  );
}
