import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getProfile } from "@/modules/users/queries";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <>
      <Header user={profile} />
      <div className="grid min-h-[calc(100vh-62px)] border-t bg-gray-50">
        <main className="mx-auto h-full min-h-0 grow px-4 md:pb-24 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
